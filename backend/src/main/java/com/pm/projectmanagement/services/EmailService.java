package com.pm.projectmanagement.services;

import com.pm.projectmanagement.models.Task;
import com.pm.projectmanagement.models.User;

public interface EmailService {
    void sendVerificationOtpEmail(String toEmail, String token);

    void sendTaskStatusChangedEmail(Task task, User changedBy, String adminEmail);
}
