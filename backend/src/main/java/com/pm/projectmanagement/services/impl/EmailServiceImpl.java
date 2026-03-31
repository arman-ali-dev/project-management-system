package com.pm.projectmanagement.services.impl;


import com.pm.projectmanagement.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    final private JavaMailSender mailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    @Override
    public void sendVerificationOtpEmail(String toEmail, String token) {
        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            String resetUrl = "http://localhost:5173/set-password?token=" + token;

            String htmlContent =
                    "<div style='font-family: Arial, sans-serif;'>"
                            + "<h2>Welcome to Project Management System</h2>"
                            + "<p>Your account has been created.</p>"
                            + "<p>Click the button below to set your password:</p>"
                            + "<a href='" + resetUrl + "' "
                            + "style='background:#000;color:#fff;padding:10px 15px;"
                            + "text-decoration:none;border-radius:5px;'>"
                            + "Set Password</a>"
                            + "<p>This link will expire in 24 hours.</p>"
                            + "<p>Regards,<br/>Project Management Team</p>"
                            + "</div>";

            helper.setTo(toEmail);
            helper.setSubject("Set Your Password – Project Management System");
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new MailSendException("Failed to send email");
        }
    }
}
