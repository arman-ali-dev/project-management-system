package com.pm.projectmanagement.services;

import com.pm.projectmanagement.models.Document;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    List<Document> getRecentFiles(String jwt);

    List<Document> getPublicFiles(String jwt);

    Document uploadFile(Document document, Long folderId, String jwt);

    void deleteFile(Long documentId, String jwt);

    Document updateVisibility(Long documentId, String visibility, String jwt);

    Document getDocument(Long documentId);
}
