package com.pm.projectmanagement.controllers.admin;

import com.pm.projectmanagement.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/documents")
public class AdminDocumentController {

    private final DocumentService documentService;

    @Autowired
    public AdminDocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<String> deleteFileHandler(
            @PathVariable Long documentId, @RequestHeader("Authorization") String jwt) {
        documentService.deleteFile(documentId, jwt);
        return new ResponseEntity<>("Document deleted successfully!", HttpStatus.OK);

    }
}
