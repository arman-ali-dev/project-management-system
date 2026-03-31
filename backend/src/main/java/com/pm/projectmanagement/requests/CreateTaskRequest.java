package com.pm.projectmanagement.requests;

import com.pm.projectmanagement.enums.Priority;
import com.pm.projectmanagement.enums.TaskCategory;
import com.pm.projectmanagement.enums.TaskStatus;
import com.pm.projectmanagement.models.Document;
import com.pm.projectmanagement.models.User;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateTaskRequest {
    private String title;
    private TaskCategory category;
    private String description;
    private Long project;
    private Priority priority;
    private TaskStatus status;
    private Long estimatedTime;
    private LocalDate dueDate;
    private List<User> assignedTo;
    private List<Document> documents;
}
