package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.Folder;
import com.pm.projectmanagement.services.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;

    @Autowired
    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Folder>> getFoldersHandler(@RequestHeader("Authorization") String jwt) {
        List<Folder> folders = folderService.getFolders(jwt);
        return new ResponseEntity<>(folders, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Folder> createFolderHandler(@RequestParam String name,
                                               @RequestHeader("Authorization") String jwt) {
        Folder createdFolder = folderService.createFolder(name, jwt);
        return new ResponseEntity<>(createdFolder, HttpStatus.CREATED);
    }
}