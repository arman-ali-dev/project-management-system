package com.pm.projectmanagement.repositories;

import com.pm.projectmanagement.models.Folder;
import com.pm.projectmanagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByOwnerOrderByCreatedAtDesc(User user);
}
