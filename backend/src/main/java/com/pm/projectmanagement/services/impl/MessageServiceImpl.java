package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.enums.NotificationType;
import com.pm.projectmanagement.models.ChatRoom;
import com.pm.projectmanagement.models.Message;
import com.pm.projectmanagement.models.Notification;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.ChatRoomRepository;
import com.pm.projectmanagement.repositories.MessageRepository;
import com.pm.projectmanagement.repositories.NotificationRepository;
import com.pm.projectmanagement.requests.ChatMessageRequest;
import com.pm.projectmanagement.responses.NotificationResponse;
import com.pm.projectmanagement.services.MessageService;
import com.pm.projectmanagement.services.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserService userService;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public MessageServiceImpl(
            ChatRoomRepository chatRoomRepository,
            UserService userService,
            MessageRepository messageRepository,
            NotificationRepository notificationRepository
    ) {
        this.chatRoomRepository = chatRoomRepository;
        this.userService = userService;
        this.messageRepository = messageRepository;
        this.notificationRepository = notificationRepository;
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

        Message savedMessage = messageRepository.save(message);

        saveChatNotifications(room, sender, savedMessage);

        return savedMessage;
    }

    private void saveChatNotifications(ChatRoom room, User sender, Message savedMessage) {
        if (room == null || room.getParticipants() == null || sender == null) {
            return;
        }

        for (User participant : room.getParticipants()) {
            if (
                    participant == null ||
                            participant.getId() == null ||
                            participant.getId().equals(sender.getId())
            ) {
                continue;
            }

            String body = getNotificationBody(savedMessage);

            Notification notification = Notification.builder()
                    .type(NotificationType.CHAT)
                    .title(sender.getFullName())
                    .body(body)
                    .readStatus(false)
                    .roomId(room.getId())
                    .roomName(getRoomName(room, sender, participant))
                    .sender(sender)
                    .receiver(participant)
                    .build();

            notificationRepository.save(notification);
        }
    }

    private String getNotificationBody(Message message) {
        if (message.getType() == null) {
            return message.getContent();
        }

        return switch (message.getType().toString()) {
            case "TEXT" -> message.getContent();
            case "IMAGE" -> "📷 Sent a photo";
            case "VIDEO" -> "🎥 Sent a video";
            default -> "📄 " + (
                    message.getFileName() != null
                            ? message.getFileName()
                            : "Sent a file"
            );
        };
    }

    private String getRoomName(ChatRoom room, User sender, User receiver) {
        if (room.getProject() != null && room.getProject().getName() != null) {
            return room.getProject().getName();
        }

        return sender.getFullName() != null ? sender.getFullName() : "Private Chat";
    }

    @Override
    public List<Message> getMessages(Long chatRoomId) {
        return messageRepository.findByChatRoomIdOrderBySentAtAsc(chatRoomId);
    }

    @Override
    public List<NotificationResponse> getNotifications(User currentUser) {
        return notificationRepository.findByReceiverOrderByCreatedAtDesc(currentUser)
                .stream()
                .limit(20)
                .map(notification -> NotificationResponse.builder()
                        .id(notification.getId())
                        .type(notification.getType().toString())
                        .title(notification.getTitle())
                        .body(notification.getBody())
                        .read(notification.getReadStatus())
                        .roomId(notification.getRoomId())
                        .roomName(notification.getRoomName())
                        .taskId(notification.getTaskId())
                        .taskTitle(notification.getTaskTitle())
                        .senderName(
                                notification.getSender() != null
                                        ? notification.getSender().getFullName()
                                        : null
                        )
                        .profileUrl(
                                notification.getSender() != null
                                        ? notification.getSender().getProfileImage()
                                        : null
                        )
                        .createdAt(notification.getCreatedAt())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public void clearNotifications(User user) {
        notificationRepository.deleteByReceiver(user);
    }
}