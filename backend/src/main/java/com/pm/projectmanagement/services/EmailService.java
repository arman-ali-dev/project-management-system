package com.pm.projectmanagement.services;

public interface EmailService {
    void sendVerificationOtpEmail(String toEmail, String token);
}
