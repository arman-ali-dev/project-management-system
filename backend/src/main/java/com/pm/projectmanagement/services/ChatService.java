package com.pm.projectmanagement.services;

import com.pm.projectmanagement.models.ChatRoom;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.responses.MessageResponse;

import java.util.List;

public interface ChatService {
    List<ChatRoom> getAllGroupChatRooms();

    ChatRoom createPrivateChat(User user1, User user2);

    ChatRoom getChatRoomByProject(Long projectId);

    void deleteChatRoomByProject(Long projectId);

}
