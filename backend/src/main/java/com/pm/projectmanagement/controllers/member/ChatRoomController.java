package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.ChatRoom;
import com.pm.projectmanagement.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat/rooms")
public class ChatRoomController {

    private final ChatService chatService;

    @Autowired
    public ChatRoomController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/groups")
    public ResponseEntity<List<ChatRoom>> getAllGroupChatRooms() {
        List<ChatRoom> chatRooms = chatService.getAllGroupChatRooms();
        return new ResponseEntity<>(chatRooms, HttpStatus.OK);
    }

}
