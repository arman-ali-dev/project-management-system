package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.requests.SubTaskRequest;
import com.pm.projectmanagement.responses.SubTaskResponse;
import com.pm.projectmanagement.services.SubTaskService;
import com.pm.projectmanagement.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/subtasks")
public class SubTaskController {
    private final SubTaskService subtaskService;
    private final UserService userService;

    public SubTaskController(SubTaskService subtaskService, UserService userService) {
        this.subtaskService = subtaskService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<SubTaskResponse>> getSubtasks(@PathVariable Long taskId) {
        return ResponseEntity.ok(subtaskService.getSubtasks(taskId));
    }

    @PostMapping
    public ResponseEntity<SubTaskResponse> addSubtask(
            @PathVariable Long taskId,
            @RequestBody SubTaskRequest request,
            @RequestHeader("Authorization") String jwt) {

        User user = userService.getUserProfile(jwt);
        return ResponseEntity.ok(subtaskService.addSubtask(taskId, request, String.valueOf(user.getRole())));
    }

    @PatchMapping("/{subtaskId}/toggle")
    public ResponseEntity<SubTaskResponse> toggleComplete(
            @PathVariable Long taskId,
            @PathVariable Long subtaskId,
            @RequestHeader("Authorization") String jwt) {

        User user = userService.getUserProfile(jwt);

        String email = user.getEmail();
        String role = String.valueOf(user.getRole());
        return ResponseEntity.ok(subtaskService.toggleComplete(subtaskId, email, role));
    }

    @PutMapping("/{subtaskId}")
    public ResponseEntity<SubTaskResponse> updateSubtask(
            @PathVariable Long taskId,
            @PathVariable Long subtaskId,
            @RequestBody SubTaskRequest request,
            @RequestHeader("Authorization") String jwt) {
        User user = userService.getUserProfile(jwt);
        String role = String.valueOf(user.getRole());
        return ResponseEntity.ok(subtaskService.updateSubtask(subtaskId, request, role));
    }

    @DeleteMapping("/{subtaskId}")
    public ResponseEntity<Void> deleteSubtask(
            @PathVariable Long taskId,
            @PathVariable Long subtaskId,
            @RequestHeader("Authorization") String jwt) {
        User user = userService.getUserProfile(jwt);
        String role = String.valueOf(user.getRole());
        subtaskService.deleteSubtask(subtaskId, role);
        return ResponseEntity.noContent().build();
    }


}