package com.vinay.intelliview.resume.service;

import com.vinay.intelliview.exception.ResourceNotFoundException;
import com.vinay.intelliview.resume.ats.AtsEngine;
import com.vinay.intelliview.resume.ats.AtsResult;
import com.vinay.intelliview.resume.ats.optimizer.parse.ResumeParser;
import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import com.vinay.intelliview.resume.ats.profile.ProfileLoader;
import com.vinay.intelliview.resume.dto.ResumeResponse;
import com.vinay.intelliview.resume.dto.UploadResumeResponse;
import com.vinay.intelliview.resume.entity.Resume;
import com.vinay.intelliview.resume.entity.ResumeStatus;
import com.vinay.intelliview.resume.repository.ResumeRepository;
import com.vinay.intelliview.storage.FileStorageService;
import com.vinay.intelliview.user.entity.User;
import com.vinay.intelliview.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private static final long MAX_RESUME_FILE_SIZE = 10 * 1024 * 1024;
    private static final Set<String> SUPPORTED_TARGET_ROLES = loadSupportedTargetRoles();

    private static Set<String> loadSupportedTargetRoles() {
        PathMatchingResourcePatternResolver resourceResolver =
                new PathMatchingResourcePatternResolver();

        try {
            Resource[] resources = resourceResolver.getResources(
                    "classpath*:ats/profiles/*.json"
            );

            return Arrays.stream(resources)
                    .map(Resource::getFilename)
                    .filter(StringUtils::hasText)
                    .map(filename -> filename.substring(0, filename.length() - 5))
                    .collect(Collectors.toUnmodifiableSet());
        } catch (IOException ex) {
            throw new IllegalStateException(
                    "Failed to load supported ATS profile identifiers.",
                    ex
            );
        }
    }

    private final ResumeRepository resumeRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;
    private final ResumeParser resumeParser;
    private final ProfileLoader profileLoader;
    private final AtsEngine atsEngine;

    public UploadResumeResponse uploadResume(
            MultipartFile file,
            String targetRole,
            String jobTitle,
            String company,
            String jobDescription,
            String email
    ) {

        validateUpload(file);
        String normalizedTargetRole = validateTargetRole(targetRole);
        User user = userService.findByEmail(email);
        String extractedText = resumeParser.extractText(file);
        AtsProfile profile = profileLoader.load(normalizedTargetRole);
        AtsResult atsResult = atsEngine.analyze(
                extractedText,
                applyJobDescription(profile, jobDescription)
        );

        String storedFileName = fileStorageService.storeFile(file);

        Resume resume = new Resume();

        resume.setUser(user);
        resume.setTargetRole(normalizedTargetRole);
        resume.setJobTitle(normalizeOptionalField(jobTitle, 100, "Job Title"));
        resume.setCompany(normalizeOptionalField(company, 120, "Company"));
        resume.setJobDescription(normalizeOptionalField(
                jobDescription,
                12_000,
                "Job description"
        ));
        resume.setOriginalFileName(file.getOriginalFilename());
        resume.setStoredFileName(storedFileName);
        resume.setFileType(file.getContentType());
        resume.setFileSize(file.getSize());
        resume.setStoragePath("uploads/resumes/" + storedFileName);
        resume.setStatus(ResumeStatus.ACTIVE);
        resume.setExtractedText(extractedText);
        resume.setAtsScore(atsResult.getScore());
        resume.setAiProcessed(true);

        Resume savedResume = resumeRepository.save(resume);

        return UploadResumeResponse.builder()
                .id(savedResume.getId())
                .originalFileName(savedResume.getOriginalFileName())
                .targetRole(savedResume.getTargetRole())
                .jobTitle(savedResume.getJobTitle())
                .company(savedResume.getCompany())
                .atsScore(savedResume.getAtsScore())
                .message("Resume upload and analyzed successfully")
                .build();
    }

    private String normalizeOptionalField(String value, int maximumLength, String fieldName) {

        if (!StringUtils.hasText(value)) {
            return null;
        }

        String normalized = value.trim();
        if (normalized.length() > maximumLength) {
            throw new IllegalArgumentException(fieldName + " must not exceed " + maximumLength + " characters.");
        }

        return normalized;
    }


    private AtsProfile applyJobDescription(AtsProfile profile, String jobDescription) {
        if (!StringUtils.hasText(jobDescription) || profile == null) {
            return profile;
        }

        String normalizedJobDescription = jobDescription.toLowerCase();

        List<String> jobSkills = Stream.of(
                        profile.getRequiredSkills(),
                        profile.getOptionalSkills(),
                        profile.getFrameworks(),
                        profile.getLibraries(),
                        profile.getTools(),
                        profile.getDatabases(),
                        profile.getCloudPlatforms(),
                        profile.getProgrammingLanguages()
                )
                .filter(Objects::nonNull)
                .flatMap(List::stream)
                .filter(skill -> normalizedJobDescription.contains(skill.toLowerCase()))
                .distinct()
                .toList();

        if (jobSkills.isEmpty()) {
            return profile;
        }

        return AtsProfile.builder()
                .id(profile.getId())
                .displayName(profile.getDisplayName())
                .description(profile.getDescription())
                .requiredSkills(jobSkills)
                .optionalSkills(profile.getOptionalSkills())
                .frameworks(profile.getFrameworks())
                .libraries(profile.getLibraries())
                .tools(profile.getTools())
                .databases(profile.getDatabases())
                .cloudPlatforms(profile.getCloudPlatforms())
                .programmingLanguages(profile.getProgrammingLanguages())
                .softSkills(profile.getSoftSkills())
                .requiredSections(profile.getRequiredSections())
                .preferredSections(profile.getPreferredSections())
                .educationKeywords(profile.getEducationKeywords())
                .experienceKeywords(profile.getExperienceKeywords())
                .projectKeywords(profile.getProjectKeywords())
                .certificationKeywords(profile.getCertificationKeywords())
                .atsKeywords(profile.getAtsKeywords())
                .minimumScore(profile.getMinimumScore())
                .build();
    }

    private String validateTargetRole(String targetRole) {

        if (!StringUtils.hasText(targetRole)) {
            throw new IllegalArgumentException("Target role is invalid.");
        }
        String normalizedTargetRole = targetRole.trim();
        if (normalizedTargetRole.isEmpty() || normalizedTargetRole.length() > 100
                || normalizedTargetRole.contains("/")
                || normalizedTargetRole.contains("\\")
                || !SUPPORTED_TARGET_ROLES.contains(normalizedTargetRole)
        ) {
            throw new IllegalArgumentException("Target role is invalid.");
        }
        return normalizedTargetRole;
    }

    private void validateUpload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file is required.");
        }
        if (file.getSize() > MAX_RESUME_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "Resume file must not exceed 10 MB."
            );
        }
        String fileName = file.getOriginalFilename();
        if (!StringUtils.hasText(fileName)
                || !fileName.toLowerCase().endsWith(".pdf")
                || !"application/pdf".equalsIgnoreCase(file.getContentType())
        ) {
            throw new IllegalArgumentException("Resume file must be a PDF.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            byte[] signature = inputStream.readNBytes(5);
            if (!"%PDF-".equals(new String(signature, StandardCharsets.US_ASCII))) {
                throw new IllegalArgumentException("Resume file must be valid PDF.");
            }
        } catch (IOException e) {
            throw new RuntimeException("Resume file could not be read.");
        }
    }

    public UploadResumeResponse uploadResume(
            MultipartFile file,
            String targetRole,
            String email
    ) {
        return uploadResume(file, targetRole, null, null, null, email);
    }

    public List<ResumeResponse> getMyResumes(String email) {

        User user = userService.findByEmail(email);
        List<Resume> resumes = resumeRepository.findByUser(user);

        return resumes.stream()
                .map(this::mapToResumeResponse)
                .toList();
    }

    private ResumeResponse mapToResumeResponse(
            Resume resume
    ) {

        return ResumeResponse.builder()
                .id(resume.getId())
                .originalFileName(resume.getOriginalFileName())
                .targetRole(resume.getTargetRole())
                .jobTitle(resume.getJobTitle())
                .company(resume.getCompany())
                .fileType(resume.getFileType())
                .fileSize(resume.getFileSize())
                .status(resume.getStatus())
                .atsScore(resume.getAtsScore())
                .aiProcessed(resume.isAiProcessed())
                .createdAt(resume.getCreatedAt())
                .build();
    }

    public ResumeResponse.AtsReportResponse analyzeResume(
            Long resumeId,
            String email
    ) {

        User user = userService.findByEmail(email);

        Resume resume = resumeRepository
                .findByIdAndUser(resumeId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resume not found."
                        )
                );

        AtsProfile profile = applyJobDescription(
                profileLoader.load(resume.getTargetRole()),
                resume.getJobDescription()
        );
        AtsResult atsResult = atsEngine.analyze(
                resume.getExtractedText(),
                profile
        );

        Map<String, Integer> categoryScores =
                calculateCategoryScores(atsResult);
        Map<String, String> categoryStatus =
                calculateCategoryStatus(categoryScores);
        int overallScore = calculateOverallScore(categoryScores);

        return ResumeResponse.AtsReportResponse.builder()
                .resumeId(resume.getId())
                .targetRole(resume.getTargetRole())
                .jobTitle(resume.getJobTitle())
                .company(resume.getCompany())
                .overallScore(overallScore)
                .categoryScores(categoryScores)
                .categoryStatus(categoryStatus)
                .summary(buildSummary(overallScore, categoryStatus))
                .priorityImprovements(buildPriorityImprovements(
                        categoryStatus,
                        atsResult.getMissingSkills()
                ))
                .strengths(atsResult.getStrengths())
                .improvements(atsResult.getImprovements())
                .matchedSkills(atsResult.getMatchedSkills())
                .missingSkills(atsResult.getMissingSkills())
                .matchedEducation(atsResult.getMatchedEducation())
                .missingEducation(atsResult.getMissingEducation())
                .matchedExperience(atsResult.getMatchedExperience())
                .missingExperience(atsResult.getMissingExperience())
                .matchedProjects(atsResult.getMatchedProjects())
                .missingProjects(atsResult.getMissingProjects())
                .matchedCertifications(atsResult.getMatchedCertifications())
                .missingCertifications(atsResult.getMissingCertifications())
                .build();
    }

    private Map<String, String> calculateCategoryStatus(Map<String, Integer> categoryScores) {
        Map<String, String> categoryStatus = new LinkedHashMap<>();

        categoryScores.forEach((category, score) ->
                categoryStatus.put(category, getCategoryStatus(score))
        );

        return categoryStatus;
    }

    private String getCategoryStatus(int score) {

        if (score >= 80) {
            return "GOOD";
        }

        if (score >= 50) {
            return "AVERAGE";
        }

        return "NEEDS_IMPROVEMENT";
    }


    private List<String> buildPriorityImprovements(Map<String, String> categoryStatus, List<String> missingSkills) {
        Set<String> priorityImprovements = new LinkedHashSet<>();

        categoryStatus.forEach((category, status) -> {
            if ("NEEDS_IMPROVEMENT".equals(status)) {
                priorityImprovements.add(
                        "Improve " + category.toLowerCase() + " coverage."
                );
            }
        });

        missingSkills.forEach(skill -> priorityImprovements.add(
                "Add required skill: " + skill
        ));

        return List.copyOf(priorityImprovements);
    }
    private String buildSummary(int overallScore, Map<String, String> categoryStatus) {
        List<String> categoriesNeedingImprovement = categoryStatus.entrySet()
                .stream()
                .filter(entry -> "NEEDS_IMPROVEMENT".equals(entry.getValue()))
                .map(Map.Entry::getKey)
                .toList();

        if (categoriesNeedingImprovement.isEmpty()) {
            return "Overall ATS score: " + overallScore
                    + ". No categories need immediate improvement.";
        }

        return "Overall ATS score: " + overallScore
                + ". Prioritize "
                + String.join(", ", categoriesNeedingImprovement)
                + ".";
    }

    private int calculateOverallScore(Map<String, Integer> categoryScores) {
        return (int) Math.round(
                categoryScores.values().stream()
                        .mapToInt(Integer::intValue)
                        .average()
                        .orElse(0)
        );
    }

    private Map<String, Integer> calculateCategoryScores(AtsResult atsResult) {
        Map<String, Integer> categoryScores = new LinkedHashMap<>();

        addCategoryScore(
                categoryScores,
                "SKILLS",
                atsResult.getMatchedSkills(),
                atsResult.getMissingSkills()
        );
        addCategoryScore(
                categoryScores,
                "EDUCATION",
                atsResult.getMatchedEducation(),
                atsResult.getMissingEducation()
        );
        addCategoryScore(
                categoryScores,
                "EXPERIENCE",
                atsResult.getMatchedExperience(),
                atsResult.getMissingExperience()
        );
        addCategoryScore(
                categoryScores,
                "PROJECTS",
                atsResult.getMatchedProjects(),
                atsResult.getMissingProjects()
        );
        addCategoryScore(
                categoryScores,
                "CERTIFICATIONS",
                atsResult.getMatchedCertifications(),
                atsResult.getMissingCertifications()
        );

        return categoryScores;
    }

    private void addCategoryScore(Map<String, Integer> categoryScores, String category, List<String> matchedItems, List<String> missingItems) {
        int assessedItems = matchedItems.size() + missingItems.size();

        if (assessedItems == 0) {
            return;
        }

        int score = (int) Math.round(
                (matchedItems.size() * 100.0) / assessedItems
        );

        categoryScores.put(category, score);
    }


    public void deleteResume(Long resumeId, String email) {
        User user = userService.findByEmail(email);

        Resume resume = resumeRepository
                .findByIdAndUser(resumeId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resume not found."
                        )
                );

        fileStorageService.deleteFile(
                resume.getStoredFileName()
        );
        resumeRepository.delete(resume);
    }
}
