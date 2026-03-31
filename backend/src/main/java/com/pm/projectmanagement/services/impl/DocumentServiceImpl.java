package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.enums.DocumentVisibility;
import com.pm.projectmanagement.enums.UserRole;
import com.pm.projectmanagement.exceptions.NotFoundException;
import com.pm.projectmanagement.models.Document;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.DocumentRepository;
import com.pm.projectmanagement.services.DocumentService;
import com.pm.projectmanagement.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final UserService userService;

    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository, UserService userService) {
        this.documentRepository = documentRepository;
        this.userService = userService;
    }

    @Override
    public List<Document> getRecentFiles(String jwt) {
        User user = userService.getUserProfile(jwt);
        return documentRepository.findTop5ByUploadedByOrderByCreatedAtDesc(user);
    }

    @Override
    public List<Document> getPublicFiles(String jwt) {
        return documentRepository.findByVisibilityOrderByCreatedAtDesc(DocumentVisibility.PUBLIC);
    }

    @Override
    public Document uploadFile(Document document, Long folderId, String jwt) {
        User user = userService.getUserProfile(jwt);
        document.setUploadedBy(user);
        return documentRepository.save(document);
    }

    @Override
    public void deleteFile(Long documentId, String jwt) {
        User user = userService.getUserProfile(jwt);
        Document document = this.getDocument(documentId);

        if (!document.getUploadedBy().getId().equals(user.getId()) &&
                !user.getRole().equals(UserRole.ADMIN)) {
            throw new RuntimeException("Unauthorized to delete this file");
        }

        documentRepository.deleteById(documentId);
    }

    @Override
    public Document updateVisibility(Long documentId, String visibility, String jwt) {
        Document document = this.getDocument(documentId);

        document.setVisibility(DocumentVisibility.valueOf(visibility.toUpperCase()));
        return documentRepository.save(document);
    }

    @Override
    public Document getDocument(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new NotFoundException("File not found"));
    }
}
