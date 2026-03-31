package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.enums.ChatType;
import com.pm.projectmanagement.exceptions.NotFoundException;
import com.pm.projectmanagement.models.ChatRoom;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.ChatRoomRepository;
import com.pm.projectmanagement.repositories.UserRepository;
import com.pm.projectmanagement.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public ChatServiceImpl(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

    @Override
    public List<ChatRoom> getAllGroupChatRooms() {
        return chatRoomRepository.findByType(ChatType.GROUP);
    }

    @Override
    public ChatRoom createPrivateChat(User user1, User user2) {
        ChatRoom room = new ChatRoom();
        room.setType(ChatType.PRIVATE);
        room.setParticipants(List.of(user1, user2));

        return chatRoomRepository.save(room);
    }

    @Override
    public ChatRoom getChatRoomByProject(Long projectId) {
        return  chatRoomRepository.findByProjectId(projectId)
                .orElseThrow(() -> new NotFoundException("Chat Room not found!"));
    }

    @Override
    public void deleteChatRoomByProject(Long projectId) {
        ChatRoom chatRoom = this.getChatRoomByProject(projectId);
        chatRoomRepository.delete(chatRoom);
    }
}
