package com.pm.projectmanagement.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pm.projectmanagement.enums.ChatType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // GROUP or PRIVATE
    @Enumerated(EnumType.STRING)
    private ChatType type;

    // For project chat
    @OneToOne
    @JoinColumn(name = "project_id")
    private Project project;

    // For private chat (2 users)
    @ManyToMany
    @JoinTable(
            name = "chat_room_users",
            joinColumns = @JoinColumn(name = "chat_room_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private List<User> participants;

    @CreationTimestamp
    private LocalDateTime createdAt;
}