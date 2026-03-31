package com.pm.projectmanagement.services;

import com.pm.projectmanagement.enums.Priority;
import com.pm.projectmanagement.enums.TaskStatus;
import com.pm.projectmanagement.models.Task;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.requests.CreateTaskRequest;
import com.pm.projectmanagement.responses.ReminderResponse;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TaskService {
    Task createTask(CreateTaskRequest request, String jwt);

    Task updateTask(Long id, Task task);

    Task getTask(Long id);

    void deleteTask(Long id);

    List<Task> getAllTasks();

    Task changeStatus(Long id, TaskStatus status, User user) throws AccessDeniedException;

    List<Task> getAllMyTasks(Long userId);

    List<Task> filterTasks(TaskStatus status, Priority priority);

    List<Task> getTasksByProject(Long projectId);

    Task addMember(Long taskId, List<User> users);

    Map<LocalDate, Integer> getTasksCountByMonth(int month, int year, User user);

    public Map<LocalDate, List<Task>> getTasksByDateForMonth(int month, int year, User user);

    public List<ReminderResponse> getTaskReminders(User user);
}
