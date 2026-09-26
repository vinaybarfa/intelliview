package com.vinay.intelliview.job.service;

import com.vinay.intelliview.job.dto.JobMatchResponse;
import com.vinay.intelliview.job.entity.Job;
import com.vinay.intelliview.job.repository.JobRepository;
import com.vinay.intelliview.resume.entity.Resume;
import com.vinay.intelliview.resume.repository.ResumeRepository;
import com.vinay.intelliview.user.entity.User;
import com.vinay.intelliview.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobMatchService {

    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public List<JobMatchResponse> getJobMatches(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Job> jobs = jobRepository
                .findAllByUserOrderByCreatedAtDesc(user);

        List<Resume> resumes = resumeRepository.findByUser(user);

        List<JobMatchResponse> matches = new ArrayList<>();

        for (Job job : jobs) {
            for (Resume resume : resumes) {

                JobMatchResponse match = calculateMatch(job, resume);

                matches.add(match);
            }
        }

        matches.sort(
                Comparator.comparingDouble(JobMatchResponse::getMatchScore)
                        .reversed()
        );

        return matches;
    }

    public JobMatchResponse matchJob(
            String email,
            Long jobId,
            Long resumeId
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Job job = jobRepository.findByIdAndUser(jobId, user)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        Resume resume = resumeRepository.findByIdAndUser(resumeId, user)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        return calculateMatch(job, resume);
    }

    private JobMatchResponse calculateMatch(
            Job job,
            Resume resume
    ) {

        String jobText = buildJobText(job);
        String resumeText = buildResumeText(resume);

        Set<String> jobKeywords = extractKeywords(jobText);
        Set<String> resumeKeywords = extractKeywords(resumeText);

        List<String> matchedKeywords = jobKeywords.stream()
                .filter(resumeKeywords::contains)
                .sorted()
                .toList();

        List<String> missingKeywords = jobKeywords.stream()
                .filter(keyword -> !resumeKeywords.contains(keyword))
                .sorted()
                .toList();

        double score = jobKeywords.isEmpty()
                ? 0
                : ((double) matchedKeywords.size()
                / jobKeywords.size()) * 100;

        return JobMatchResponse.builder()
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .companyName(job.getCompanyName())
                .resumeId(resume.getId())
                .resumeTargetRole(resume.getTargetRole())
                .matchScore(Math.round(score * 100.0) / 100.0)
                .matchedKeywords(matchedKeywords)
                .missingKeywords(missingKeywords)
                .build();
    }

    private String buildJobText(Job job) {

        return String.join(" ",
                safe(job.getTitle()),
                safe(job.getDescription()),
                safe(job.getEmploymentType()),
                safe(job.getLocation())
        );
    }

    private String buildResumeText(Resume resume) {

        return String.join(" ",
                safe(resume.getTargetRole()),
                safe(resume.getJobTitle()),
                safe(resume.getJobDescription()),
                safe(resume.getExtractedText())
        );
    }

    private Set<String> extractKeywords(String text) {

        if (text == null || text.isBlank()) {
            return Collections.emptySet();
        }

        return Arrays.stream(
                        text.toLowerCase(Locale.ROOT)
                                .replaceAll("[^a-z0-9+#.]", " ")
                                .split("\\s+")
                )
                .filter(word -> word.length() >= 2)
                .filter(word -> !STOP_WORDS.contains(word))
                .collect(Collectors.toSet());
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "and", "for", "with", "you",
            "your", "are", "our", "from", "this",
            "that", "have", "has", "will", "job",
            "role", "work", "years", "year",
            "experience", "required", "looking",
            "candidate", "using"
    );
}