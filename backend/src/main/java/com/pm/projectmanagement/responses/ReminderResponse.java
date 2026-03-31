package com.pm.projectmanagement.responses;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReminderResponse {
    private Long id;
    private String title;
    private String message;
    private String dueDate;
    private String priority;
}
