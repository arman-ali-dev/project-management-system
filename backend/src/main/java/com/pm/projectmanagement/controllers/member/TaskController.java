package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.enums.TaskStatus;
import com.pm.projectmanagement.models.Task;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.responses.ReminderResponse;
import com.pm.projectmanagement.services.TaskService;
import com.pm.projectmanagement.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    @Autowired
    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<Task>> getAllMyTasksHandler(@RequestHeader("Authorization") String jwt) {
        User user = userService.getUserProfile(jwt);
        List<Task> tasks = taskService.getAllMyTasks(user.getId());
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> changeStatusHandler(
            @PathVariable Long id, @RequestParam TaskStatus status, @RequestHeader("Authorization") String jwt)
            throws AccessDeniedException {
        User user = userService.getUserProfile(jwt);
        Task task = taskService.changeStatus(id, status, user);
        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }


    @GetMapping("/calendar")
    public ResponseEntity<Map<LocalDate, Integer>> getTasksCountByDate(
            @RequestParam int month,
            @RequestParam int year,
            @RequestHeader("Authorization") String jwt
    ) {
        User user = userService.getUserProfile(jwt);
        Map<LocalDate, Integer> tasksCount = taskService.getTasksCountByMonth(month, year, user);
        return ResponseEntity.ok(tasksCount);
    }

    @GetMapping("/calendar/details")
    public ResponseEntity<Map<LocalDate, List<Task>>> getTasksCalendarDetails(
            @RequestParam int month,
            @RequestParam int year,
            @RequestHeader("Authorization") String jwt
    ) {
        User user = userService.getUserProfile(jwt);
        Map<LocalDate, List<Task>> tasksByDate = taskService.getTasksByDateForMonth(month, year, user);
        return ResponseEntity.ok(tasksByDate);
    }

    @GetMapping("/reminders")
    public ResponseEntity<List<ReminderResponse>> getReminders(
            @RequestHeader("Authorization") String jwt
    ) {
        User user = userService.getUserProfile(jwt);
        List<ReminderResponse> response =  taskService.getTaskReminders(user);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
