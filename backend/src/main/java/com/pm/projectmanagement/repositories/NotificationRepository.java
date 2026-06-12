package com.pm.projectmanagement.repositories;

import com.pm.projectmanagement.models.Notification;
import com.pm.projectmanagement.models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByReceiverOrderByCreatedAtDesc(User receiver);

    @Transactional
    void deleteByReceiver(User receiver);
}