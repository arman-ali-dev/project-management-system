package com.pm.projectmanagement.responses;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubTaskResponse {
    private Long    id;
    private String  title;
    private boolean completed;
    private Long    taskId;

    private Long    assignedToId;
    private String  assignedToName;
    private String  assignedToImage;

    private LocalDateTime createdAt;
}