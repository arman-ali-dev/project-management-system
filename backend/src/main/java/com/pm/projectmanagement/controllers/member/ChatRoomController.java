package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.ChatRoom;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.responses.PrivateChatRoomResponse;
import com.pm.projectmanagement.services.ChatService;
import com.pm.projectmanagement.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat/rooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatService chatService;
    private final UserService userService;

    @GetMapping("/groups")
    public ResponseEntity<List<ChatRoom>> getAllGroupChatRooms() {
        return ResponseEntity.ok(chatService.getAllGroupChatRooms());
    }

    @GetMapping("/private")
    public ResponseEntity<List<PrivateChatRoomResponse>> getMyPrivateRooms(
            @RequestHeader("Authorization") String jwt) {

        User currentUser = userService.getUserProfile(jwt);
        List<ChatRoom> rooms = chatService.getPrivateRoomsForUser(currentUser.getId());

        List<PrivateChatRoomResponse> response = rooms.stream()
                .map(this::toPrivateRoomResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/private/{otherUserId}")
    public ResponseEntity<PrivateChatRoomResponse> getOrCreatePrivateRoom(
            @PathVariable Long otherUserId,
            @RequestHeader("Authorization") String jwt) {

        User currentUser = userService.getUserProfile(jwt);
        User otherUser   = userService.getUserById(otherUserId);

        ChatRoom room = chatService.getOrCreatePrivateRoom(currentUser, otherUser);
        return ResponseEntity.ok(toPrivateRoomResponse(room));
    }

    private PrivateChatRoomResponse toPrivateRoomResponse(ChatRoom room) {
        List<PrivateChatRoomResponse.ParticipantDto> participants = room.getParticipants()
                .stream()
                .map(p -> PrivateChatRoomResponse.ParticipantDto.builder()
                        .id(p.getId())
                        .fullName(p.getFullName())
                        .profileImage(p.getProfileImage())
                        .email(p.getEmail())
                        .build())
                .collect(Collectors.toList());

        return PrivateChatRoomResponse.builder()
                .id(room.getId())
                .type(room.getType().toString())
                .participants(participants)
                .createdAt(room.getCreatedAt())
                .build();
    }
}