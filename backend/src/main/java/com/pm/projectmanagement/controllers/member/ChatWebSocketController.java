package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.Message;
import com.pm.projectmanagement.requests.ChatMessageRequest;
import com.pm.projectmanagement.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;

    @MessageMapping("/chat.sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable Long roomId,
            ChatMessageRequest request
    ) {

        return messageService.sendMessage(
                roomId,
                request
        );
    }
}