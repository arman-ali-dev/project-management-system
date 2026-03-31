package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.enums.FileType;
import com.pm.projectmanagement.enums.UserRole;
import com.pm.projectmanagement.exceptions.NotFoundException;
import com.pm.projectmanagement.models.Folder;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.FolderRepository;
import com.pm.projectmanagement.services.FolderService;
import com.pm.projectmanagement.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FolderServiceImpl implements FolderService {

    private final FolderRepository folderRepository;
    private final UserService userService;

    @Autowired
    public FolderServiceImpl(FolderRepository folderRepository, UserService userService) {
        this.folderRepository = folderRepository;
        this.userService = userService;
    }

    @Override
    public List<Folder> getFolders(String jwt) {
        User user = userService.getUserProfile(jwt);
        return folderRepository.findByOwnerOrderByCreatedAtDesc(user);
    }

    @Override
    public Folder createFolder(String name, String jwt) {
        User user = userService.getUserProfile(jwt);
        Folder folder = new Folder();
        folder.setName(name);
        folder.setOwner(user);
        return folderRepository.save(folder);
    }

    @Override
    public void deleteFolder(Long folderId, String jwt) {
        User user = userService.getUserProfile(jwt);
        Folder folder = this.getFolder(folderId);

        if (!folder.getOwner().getId().equals(user.getId()) &&
                !user.getRole().equals(UserRole.ADMIN)) {
            throw new RuntimeException("Unauthorized to delete this folder");
        }

        folderRepository.deleteById(folderId);
    }

    @Override
    public Folder getFolder(Long folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new NotFoundException("Folder not found"));
    }


}
