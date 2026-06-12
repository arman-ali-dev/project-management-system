package com.pm.projectmanagement.repositories;

import com.pm.projectmanagement.enums.ChatType;
import com.pm.projectmanagement.models.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByProjectId(Long projectId);

    List<ChatRoom> findByType(ChatType type);

    @Query("""
        SELECT cr FROM ChatRoom cr
        JOIN cr.participants p1
        JOIN cr.participants p2
        WHERE cr.type = 'PRIVATE'
        AND p1.id = :userId1
        AND p2.id = :userId2
    """)
    List<ChatRoom> findPrivateRoomBetweenUsers(
            @Param("userId1") Long userId1,
            @Param("userId2") Long userId2
    );

    @Query("""
        SELECT cr FROM ChatRoom cr
        JOIN cr.participants p
        WHERE cr.type = 'PRIVATE'
        AND p.id = :userId
    """)
    List<ChatRoom> findPrivateRoomsByUserId(@Param("userId") Long userId);


}