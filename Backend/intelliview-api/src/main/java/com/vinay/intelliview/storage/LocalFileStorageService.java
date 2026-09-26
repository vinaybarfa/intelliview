package com.vinay.intelliview.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    private static final String UPLOAD_DIRECTORY = "upload/resume";

    @Override
    public String storeFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIRECTORY)
                    .toAbsolutePath()
                    .normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String storedFileName = UUID.randomUUID() + ".pdf";
            Path destination = uploadPath.resolve(storedFileName).normalize();
            if (!destination.startsWith(uploadPath)) {
                throw new IllegalArgumentException("Invalid storage destination");
            }

            Files.copy(
                    file.getInputStream(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return storedFileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public void deleteFile(String storedFileName) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIRECTORY)
                    .toAbsolutePath()
                    .normalize();
            Path filePath = uploadPath.resolve(storedFileName).normalize();
            if (!filePath.startsWith(uploadPath)) {
                throw new IllegalArgumentException("Invalid stored file name.");
            }

            Files.deleteIfExists(filePath);

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }
}
