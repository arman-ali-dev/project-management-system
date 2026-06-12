package com.pm.projectmanagement.responses;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private String type;
    private String title;
    private String body;

    private Boolean read;

    private Long roomId;
    private String roomName;

    private Long taskId;
    private String taskTitle;

    private String senderName;
    private String profileUrl;

    private LocalDateTime createdAt;
}