package com.pm.projectmanagement.controllers.admin;

import com.pm.projectmanagement.services.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/folders")
public class AdminFolderController {

    private final FolderService folderService;

    @Autowired
    public AdminFolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @DeleteMapping("/{folderId}")
    public ResponseEntity<String> deleteFolderHandler(
            @PathVariable Long folderId, @RequestHeader("Authorization") String jwt) {
        folderService.deleteFolder(folderId, jwt);
        return new ResponseEntity<>("Folder deleted successfully!", HttpStatus.OK);
    }
}
