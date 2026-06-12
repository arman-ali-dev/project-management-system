package com.pm.projectmanagement.responses;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivateChatRoomResponse {
    private Long              id;
    private String            type;
    private List<ParticipantDto> participants;
    private LocalDateTime     createdAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ParticipantDto {
        private Long   id;
        private String fullName;
        private String profileImage;
        private String email;
    }
}
