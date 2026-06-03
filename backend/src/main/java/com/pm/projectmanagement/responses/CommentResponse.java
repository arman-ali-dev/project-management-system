package com.pm.projectmanagement.responses;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private Long taskId;
    private Long authorId;
    private String authorName;
    private String authorImage;
    private LocalDateTime createdAt;
}
