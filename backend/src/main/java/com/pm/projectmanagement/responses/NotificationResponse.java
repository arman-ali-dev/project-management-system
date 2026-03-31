package com.pm.projectmanagement.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {
    private String profileUrl;
    private String username;
    private String message;
    private String time;
    private String status;
}
