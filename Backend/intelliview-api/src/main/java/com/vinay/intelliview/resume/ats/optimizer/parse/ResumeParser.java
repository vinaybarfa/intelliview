package com.vinay.intelliview.resume.ats.optimizer.parse;

import org.springframework.web.multipart.MultipartFile;

public interface ResumeParser {

    String extractText(MultipartFile file);

}
