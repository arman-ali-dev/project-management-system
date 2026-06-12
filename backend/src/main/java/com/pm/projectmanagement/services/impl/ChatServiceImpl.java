package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.enums.ChatType;
import com.pm.projectmanagement.exceptions.NotFoundException;
import com.pm.projectmanagement.models.ChatRoom;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.ChatRoomRepository;
import com.pm.projectmanagement.repositories.MessageRepository;
import com.pm.projectmanagement.repositories.UserRepository;
import com.pm.projectmanagement.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;

    @Autowired
    public ChatServiceImpl(ChatRoomRepository chatRoomRepository, MessageRepository messageRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
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
        return chatRoomRepository.findByProjectId(projectId)
                .orElseThrow(() -> new NotFoundException("Chat Room not found!"));
    }

    @Override
    public void deleteChatRoomByProject(Long projectId) {
        ChatRoom room = chatRoomRepository.findByProjectId(projectId)
                .orElse(null);
        if (room == null) return;

        messageRepository.deleteAllByChatRoomId(room.getId());

        chatRoomRepository.delete(room);
    }

    @Override
    public ChatRoom getOrCreatePrivateRoom(User currentUser, User otherUser) {
        List<ChatRoom> existing = chatRoomRepository
                .findPrivateRoomBetweenUsers(currentUser.getId(), otherUser.getId());

        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        ChatRoom room = new ChatRoom();
        room.setType(ChatType.PRIVATE);
        room.setParticipants(List.of(currentUser, otherUser));

        return chatRoomRepository.save(room);
    }

    @Override
    public List<ChatRoom> getPrivateRoomsForUser(Long userId) {
        return chatRoomRepository.findPrivateRoomsByUserId(userId);
    }
}
