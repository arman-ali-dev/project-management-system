package com.pm.projectmanagement.repositories;

import com.pm.projectmanagement.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoomIdOrderBySentAtAsc(Long chatRoomId);

    @Query("""
   SELECT m FROM Message m
   WHERE m.sender.id != :userId
   AND m.chatRoom IN (
       SELECT cr FROM ChatRoom cr
       JOIN cr.participants u
       WHERE u.id = :userId
   )
   ORDER BY m.sentAt DESC
""")
    List<Message> findLatestGroupMessages(@Param("userId") Long userId);
}
