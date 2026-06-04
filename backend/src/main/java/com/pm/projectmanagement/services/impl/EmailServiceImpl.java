package com.pm.projectmanagement.services.impl;


import com.pm.projectmanagement.models.Task;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
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

            String resetUrl = "connect.a2groups.org/set-password?token=" + token;

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

    @Override
    @Async
    public void sendTaskStatusChangedEmail(Task task, User changedBy, String adminEmail) {

        try {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String statusColor = switch (task.getStatus().toString()) {
                case "IN_PROGRESS" -> "#E8A020";
                case "DONE" -> "#09C015";
                default -> "#497AF5";
            };

            String orderId = task.getProject() != null
                    ? task.getProject().getOrderId()
                    : "N/A";

            String htmlContent =
                    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto;'>"

                            // Header
                            + "<div style='background: #000; padding: 24px 30px; border-radius: 8px 8px 0 0;'>"
                            + "<h2 style='color: #fff; margin: 0; font-size: 18px;'>Task Status Updated</h2>"
                            + "<p style='color: #aaa; margin: 4px 0 0; font-size: 13px;'>Project Management System</p>"
                            + "</div>"

                            // Body
                            + "<div style='background: #f9f9f9; padding: 28px 30px; border: 1px solid #eee;'>"

                            + "<p style='color: #444; font-size: 14px; margin: 0 0 20px;'>Hi Admin,</p>"

                            + "<p style='color: #444; font-size: 14px; margin: 0 0 20px;'>"
                            + "A task has been updated by a team member. Here are the details:"
                            + "</p>"

                            + "<div style='background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px;'>"

                            // Order ID
                            + "<div style='margin-bottom: 14px;'>"
                            + "<span style='font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px;'>Order ID</span>"
                            + "<p style='font-size: 16px; font-weight: 700; color: #111; margin: 4px 0 0;'>"
                            + orderId
                            + "</p>"
                            + "</div>"

                            // Task Name
                            + "<div style='margin-bottom: 14px;'>"
                            + "<span style='font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px;'>Task Name</span>"
                            + "<p style='font-size: 15px; font-weight: 600; color: #111; margin: 4px 0 0;'>"
                            + task.getTitle()
                            + "</p>"
                            + "</div>"

                            // Status
                            + "<div style='margin-bottom: 14px;'>"
                            + "<span style='font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px;'>New Status</span>"
                            + "<p style='margin: 6px 0 0;'>"
                            + "<span style='background: "
                            + statusColor
                            + "22; color: "
                            + statusColor
                            + "; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;'>"
                            + task.getStatus()
                            + "</span>"
                            + "</p>"
                            + "</div>"

                            // Updated By
                            + "<div>"
                            + "<span style='font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px;'>Updated By</span>"
                            + "<p style='font-size: 14px; color: #333; margin: 4px 0 0;'>"
                            + changedBy.getFullName()
                            + " <span style='color: #999;'>("
                            + changedBy.getEmail()
                            + ")</span>"
                            + "</p>"
                            + "</div>"

                            + "</div>"

                            + "<p style='color: #888; font-size: 12px; margin: 24px 0 0;'>"
                            + "Please login to review and take action if needed."
                            + "</p>"

                            + "</div>"

                            // Footer
                            + "<div style='background: #f0f0f0; padding: 14px 30px; border-radius: 0 0 8px 8px; "
                            + "text-align: center; border: 1px solid #eee; border-top: none;'>"
                            + "<p style='color: #aaa; font-size: 11px; margin: 0;'>"
                            + "Project Management System | Automated Notification"
                            + "</p>"
                            + "</div>"

                            + "</div>";

            helper.setTo(adminEmail);

            helper.setSubject(
                    orderId + " - " + task.getTitle() + " - Status Updated"
            );

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new MailSendException("Failed to send task status email");
        }
    }

}
