package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.Document;
import com.pm.projectmanagement.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }


    @GetMapping("/hello")
    public ResponseEntity<String> helloHandler() {
        return new ResponseEntity<>("Hello Brother!", HttpStatus.OK);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Document>> getRecentFilesHandler(@RequestHeader("Authorization") String jwt) {
        List<Document> documents = documentService.getRecentFiles(jwt);
        return new ResponseEntity<>(documents, HttpStatus.OK);
    }

    @GetMapping("/public")
    public ResponseEntity<List<Document>> getPublicFilesHandler(@RequestHeader("Authorization") String jwt) {
        System.out.println("Chala 2");
        List<Document> documents = documentService.getPublicFiles(jwt);
        return new ResponseEntity<>(documents, HttpStatus.OK);
    }

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadFileHandler(
            @RequestBody Document document,
            @RequestParam(value = "folderId", required = false) Long folderId,
            @RequestHeader("Authorization") String jwt) {
        System.out.println("Chala");
        Document uploadedDocument = documentService.uploadFile(document, folderId, jwt);
        return new ResponseEntity<>(uploadedDocument, HttpStatus.CREATED);
    }

    @PatchMapping("/{fileId}/visibility")
    public ResponseEntity<Document> updateVisibilityHandler(
            @PathVariable Long fileId,
            @RequestParam String visibility,
            @RequestHeader("Authorization") String jwt) {
        Document document = documentService.updateVisibility(fileId, visibility, jwt);
        return new ResponseEntity<>(document, HttpStatus.OK);
    }
}
