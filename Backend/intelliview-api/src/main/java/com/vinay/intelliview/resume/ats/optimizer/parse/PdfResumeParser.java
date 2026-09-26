package com.vinay.intelliview.resume.ats.optimizer.parse;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class PdfResumeParser implements ResumeParser {

    @Override
    public String extractText(MultipartFile file) {

        try (PDDocument document =
                     Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            return stripper.getText(document);

        } catch (IOException ex) {

            throw new RuntimeException(
                    "Failed to extract text from PDF.",
                    ex
            );
        }
    }
}