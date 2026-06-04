package com.pm.projectmanagement.responses;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskStatusEvent {
    private Long   taskId;
    private String taskTitle;
    private String newStatus;
    private String changedByName;
}
