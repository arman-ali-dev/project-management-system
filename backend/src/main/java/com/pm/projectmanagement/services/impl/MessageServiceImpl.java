package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.enums.MessageType;
import com.pm.projectmanagement.models.ChatRoom;
import com.pm.projectmanagement.models.Message;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.ChatRoomRepository;
import com.pm.projectmanagement.repositories.MessageRepository;
import com.pm.projectmanagement.requests.ChatMessageRequest;
import com.pm.projectmanagement.responses.NotificationResponse;
import com.pm.projectmanagement.services.MessageService;
import com.pm.projectmanagement.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserService userService;
    private final MessageRepository messageRepository;

    @Autowired
    public MessageServiceImpl(ChatRoomRepository chatRoomRepository,
                              UserService userService,
                              MessageRepository messageRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.userService = userService;
        this.messageRepository = messageRepository;
    }


    @Override
    public Message sendMessage(Long chatRoomId, ChatMessageRequest request) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        User sender = userService.getUserById(request.getSenderId());

        Message message = new Message();
        message.setChatRoom(room);
        message.setSender(sender);
        message.setContent(request.getContent());
        message.setType(request.getType());
        message.setCaption(request.getCaption());
        message.setFileName(request.getFileName());


        return messageRepository.save(message);
    }

    @Override
    public List<Message> getMessages(Long chatRoomId) {
        return messageRepository.findByChatRoomIdOrderBySentAtAsc(chatRoomId);
    }

    @Override
    public List<NotificationResponse> getNotifications(User currentUser) {
        List<Message> messages =
                messageRepository.findLatestGroupMessages(currentUser.getId());

        return messages.stream()
                .limit(10)
                .map(msg -> {

                    String status = msg.isSeen() ? "Reply" : "New";

                    return new NotificationResponse(
                            msg.getSender().getProfileImage(),
                            msg.getSender().getFullName(),
                            msg.getContent(),
                            formatTimeAgo(msg.getSentAt()),
                            status
                    );

                }).toList();
    }

    private String formatTimeAgo(LocalDateTime time) {

        Duration duration = Duration.between(time, LocalDateTime.now());

        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (minutes < 60) return minutes + " min ago";
        if (hours < 24) return hours + " hrs ago";
        return days + " days ago";
    }
}
