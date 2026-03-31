package com.pm.projectmanagement.services;

import com.pm.projectmanagement.enums.FileType;
import com.pm.projectmanagement.models.Folder;

import java.util.List;

public interface FolderService {
    List<Folder> getFolders(String jwt);

    Folder createFolder(String name, String jwt);

    void deleteFolder(Long folderId, String jwt);

    Folder getFolder(Long folderId);
}
