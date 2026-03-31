package com.pm.projectmanagement.services;

import com.pm.projectmanagement.enums.MessageType;
import com.pm.projectmanagement.models.Message;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.requests.ChatMessageRequest;
import com.pm.projectmanagement.responses.NotificationResponse;

import java.util.List;

public interface MessageService {
    Message sendMessage(Long chatRoomId, ChatMessageRequest request);

    List<Message> getMessages(Long chatRoomId);

    public List<NotificationResponse> getNotifications(User currentUser);
}
