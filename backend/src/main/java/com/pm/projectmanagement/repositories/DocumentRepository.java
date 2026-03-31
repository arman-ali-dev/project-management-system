package com.pm.projectmanagement.repositories;

import com.pm.projectmanagement.enums.DocumentVisibility;
import com.pm.projectmanagement.models.Document;
import com.pm.projectmanagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findTop5ByUploadedByOrderByCreatedAtDesc(User user);

    List<Document> findByVisibilityOrderByCreatedAtDesc(DocumentVisibility visibility);
}
