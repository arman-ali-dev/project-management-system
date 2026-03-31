package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.Message;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.responses.NotificationResponse;
import com.pm.projectmanagement.services.MessageService;
import com.pm.projectmanagement.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;

    @Autowired
    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<List<Message>> getMessagesHandler(@PathVariable Long roomId) {
        List<Message> messages = messageService.getMessages(roomId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @RequestHeader("Authorization") String jwt
    ) {
        User user = userService.getUserProfile(jwt);
        List<NotificationResponse> notifications = messageService.getNotifications(user);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

}