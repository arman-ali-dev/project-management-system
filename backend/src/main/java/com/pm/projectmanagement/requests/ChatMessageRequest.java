package com.pm.projectmanagement.requests;

import com.pm.projectmanagement.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageRequest  {
    private Long senderId;
    private String content;
    private MessageType type;
    private String caption;
    private String fileName;
}
