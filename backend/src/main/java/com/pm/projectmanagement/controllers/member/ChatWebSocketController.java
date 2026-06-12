package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.ChatRoom;
import com.pm.projectmanagement.models.Message;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.requests.ChatMessageRequest;
import com.pm.projectmanagement.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage/{roomId}")
    public void sendMessage(
            @DestinationVariable Long roomId,
            ChatMessageRequest request
    ) {
        Message savedMessage = messageService.sendMessage(roomId, request);

        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId,
                savedMessage
        );

        ChatRoom room = savedMessage.getChatRoom();
        User sender = savedMessage.getSender();

        if (
                room != null &&
                        room.getParticipants() != null &&
                        sender != null
        ) {
            for (User participant : room.getParticipants()) {
                if (
                        participant != null &&
                                participant.getId() != null &&
                                !participant.getId().equals(sender.getId())
                ) {
                    messagingTemplate.convertAndSend(
                            "/topic/chat-user/" + participant.getId(),
                            savedMessage
                    );
                }
            }
        }
    }
}