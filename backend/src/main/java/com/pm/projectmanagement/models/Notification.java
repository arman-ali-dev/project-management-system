package com.pm.projectmanagement.models;

import com.pm.projectmanagement.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private Boolean readStatus = false;

    private Long roomId;
    private String roomName;

    private Long taskId;
    private String taskTitle;

    @ManyToOne
    private User receiver;

    @ManyToOne
    private User sender;

    @CreationTimestamp
    private LocalDateTime createdAt;
}