package com.pm.projectmanagement.repositories;

import com.pm.projectmanagement.enums.ChatType;
import com.pm.projectmanagement.models.ChatRoom;
import com.pm.projectmanagement.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByProjectId(Long projectId);

    List<ChatRoom> findByType(ChatType type);

}