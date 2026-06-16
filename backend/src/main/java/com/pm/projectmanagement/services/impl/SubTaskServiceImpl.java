package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.models.SubTask;
import com.pm.projectmanagement.models.Task;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.SubTaskRepository;
import com.pm.projectmanagement.repositories.TaskRepository;
import com.pm.projectmanagement.repositories.UserRepository;
import com.pm.projectmanagement.requests.SubTaskRequest;
import com.pm.projectmanagement.responses.SubTaskResponse;
import com.pm.projectmanagement.services.SubTaskService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubTaskServiceImpl implements SubTaskService {

    private final SubTaskRepository subtaskRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public SubTaskServiceImpl(SubTaskRepository subtaskRepository,
                              TaskRepository taskRepository,
                              UserRepository userRepository) {
        this.subtaskRepository = subtaskRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }


    @Override
    public List<SubTaskResponse> getSubtasks(Long taskId) {
        return subtaskRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SubTaskResponse addSubtask(Long taskId, SubTaskRequest request, String userRole) {
        if (!"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only admins can add subtasks");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"));

        User assignedTo = null;
        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Assigned user not found"));
        }

        SubTask subtask = SubTask.builder()
                .title(request.getTitle())
                .task(task)
                .assignedTo(assignedTo)
                .completed(false)
                .build();

        return toResponse(subtaskRepository.save(subtask));
    }

    @Override
    public SubTaskResponse toggleComplete(Long subtaskId, String userEmail, String userRole) {
        SubTask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Subtask not found"));

        Task task = subtask.getTask();
        User user = userRepository.findByEmail(userEmail);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);
        boolean isAssigned = task.getAssignedTo()
                .stream()
                .anyMatch(u -> u.getId().equals(user.getId()));

        if (!isAdmin && !isAssigned) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins or assigned members can mark subtasks");
        }

        subtask.setCompleted(!subtask.isCompleted());
        return toResponse(subtaskRepository.save(subtask));
    }

    @Override
    public void deleteSubtask(Long subtaskId, String userRole) {
        if (!"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only admins can delete subtasks");
        }

        SubTask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Subtask not found"));

        subtaskRepository.delete(subtask);
    }

    @Override
    public SubTaskResponse updateSubtask(Long subtaskId, SubTaskRequest request, String userRole) {
        if (!"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Only admins can edit subtasks");
        }

        SubTask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Subtask not found"));

        if (request.getTitle() != null) {
            subtask.setTitle(request.getTitle());
        }

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Assigned user not found"));
            subtask.setAssignedTo(assignedTo);
        }

        return toResponse(subtaskRepository.save(subtask));
    }

    private SubTaskResponse toResponse(SubTask s) {
        return SubTaskResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .completed(s.isCompleted())
                .taskId(s.getTask().getId())
                .assignedToId(s.getAssignedTo() != null ? s.getAssignedTo().getId() : null)
                .assignedToName(s.getAssignedTo() != null ? s.getAssignedTo().getFullName() : null)
                .assignedToImage(s.getAssignedTo() != null ? s.getAssignedTo().getProfileImage() : null)
                .createdAt(s.getCreatedAt())
                .build();
    }
}