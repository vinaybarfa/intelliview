package com.vinay.intelliview.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(MultipartFile file);

    void deleteFile(String storedFileName);
}
