package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.enums.Priority;
import com.pm.projectmanagement.enums.TaskStatus;
import com.pm.projectmanagement.enums.UserRole;
import com.pm.projectmanagement.exceptions.NotFoundException;
import com.pm.projectmanagement.models.Document;
import com.pm.projectmanagement.models.Project;
import com.pm.projectmanagement.models.Task;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.TaskRepository;
import com.pm.projectmanagement.requests.CreateTaskRequest;
import com.pm.projectmanagement.responses.ReminderResponse;
import com.pm.projectmanagement.services.ProjectService;
import com.pm.projectmanagement.services.TaskService;
import com.pm.projectmanagement.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;


    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository,
                           ProjectService projectService,
                           UserService userService) {
        this.taskRepository = taskRepository;
        this.projectService = projectService;
        this.userService = userService;
    }

    @Override
    public Task createTask(CreateTaskRequest request, String jwt) {

        User user = userService.getUserProfile(jwt);

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setCategory(request.getCategory());
        task.setDescription(request.getDescription());

        Project project = projectService.getProject(request.getProject());

        task.setProject(project);
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setPriority(request.getPriority());
        task.setEstimatedTime(request.getEstimatedTime());
        task.setDueDate(request.getDueDate());
        task.setAssignedTo(request.getAssignedTo());

        for (Document document : request.getDocuments()) {
            document.setTask(task);
            document.setUploadedBy(user);
        }

        task.setSupportDocuments(request.getDocuments());

        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, Task task) {
        Task existingTask = this.getTask(id);

        if (task.getTitle() != null && !task.getTitle().trim().isEmpty()) {
            existingTask.setTitle(task.getTitle());
        }

        if (task.getCategory() != null) {
            existingTask.setCategory(task.getCategory());
        }

        if (task.getDescription() != null && !task.getDescription().trim().isEmpty()) {
            existingTask.setDescription(task.getDescription());
        }

        if (task.getProject() != null) {
            existingTask.setProject(task.getProject());
        }

        if (task.getPriority() != null) {
            existingTask.setPriority(task.getPriority());
        }

        if (task.getDueDate() != null) {
            existingTask.setDueDate(task.getDueDate());
        }

        if (task.getAssignedTo() != null && !task.getAssignedTo().isEmpty()) {
            existingTask.setAssignedTo(task.getAssignedTo());
        }

        if (task.getSupportDocuments() != null && !task.getSupportDocuments().isEmpty()) {
            existingTask.setSupportDocuments(task.getSupportDocuments());
        }

        if (task.getEstimatedTime() != null) {
            existingTask.setEstimatedTime(task.getEstimatedTime());
        }

        if (task.getLabels() != null && !task.getLabels().isEmpty()) {
            existingTask.setLabels(task.getLabels());
        }

        return taskRepository.save(existingTask);
    }

    @Override
    public Task getTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found with id: " + id));
    }

    @Override
    public void deleteTask(Long id) {
        Task task = this.getTask(id);
        taskRepository.delete(task);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Task changeStatus(Long id, TaskStatus status, User user) throws AccessDeniedException {

        Task task = this.getTask(id);

        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        boolean isAssignedUser = task.getAssignedTo() != null &&
                task.getAssignedTo()
                        .stream()
                        .anyMatch(u -> u.getId().equals(user.getId()));

        if (!isAdmin && !isAssignedUser) {
            throw new AccessDeniedException(
                    "You are not allowed to change the status of this task"
            );
        }

        task.setStatus(status);
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getAllMyTasks(Long userId) {
        return taskRepository.findAllTasksAssignedToUser(userId);
    }

    @Override
    public List<Task> filterTasks(TaskStatus status, Priority priority) {
        if (status != null) {
            return taskRepository
                    .findByStatusOrderByCreatedAtDesc(status);
        }

        if (priority != null) {
            return taskRepository
                    .findByPriorityOrderByCreatedAtDesc(priority);
        }

        return taskRepository.findAll(
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
    }

    @Override
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public Task addMember(Long taskId, List<User> users) {
        Task task = this.getTask(taskId);
        task.setAssignedTo(users);
        return taskRepository.save(task);
    }

    @Override
    public Map<LocalDate, Integer> getTasksCountByMonth(int month, int year, User user) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);


        List<Task> tasks;

        if (user.getRole().equals(UserRole.ADMIN)) {
            tasks = taskRepository.findByDueDateBetween(startDate, endDate);
        } else {
            tasks = taskRepository.findByDueDateBetweenAndAssignedToContaining(
                    startDate,
                    endDate,
                    user
            );
        }

        return tasks.stream()
                .collect(Collectors.groupingBy(
                        Task::getDueDate,
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
    }

    @Override
    public Map<LocalDate, List<Task>> getTasksByDateForMonth(int month, int year, User user) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        List<Task> tasks;

        if (user.getRole().equals(UserRole.ADMIN)) {
            tasks = taskRepository.findByDueDateBetween(startDate, endDate);
        } else {
            tasks = taskRepository.findByDueDateBetweenAndAssignedToContaining(
                    startDate,
                    endDate,
                    user
            );
        }


        return tasks.stream()
                .collect(Collectors.groupingBy(Task::getDueDate));

    }

    @Override
    public List<ReminderResponse> getTaskReminders(User user) {
        List<Task> tasks = taskRepository.findUserActiveTasks(user);

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");

        return tasks.stream()
                .filter(task -> task.getStatus() != TaskStatus.DONE)
                .map(task -> {

                    String priority;
                    String message;

                    if (task.getDueDate().isBefore(today)) {
                        priority = "OVERDUE";
                        message = "Task is overdue";
                    }
                    else if (task.getDueDate().isEqual(today)) {
                        priority = "TODAY";
                        message = "Task is due today";
                    }
                    else if (task.getDueDate().isEqual(tomorrow)) {
                        priority = "TOMORROW";
                        message = "Task is due tomorrow";
                    }
                    else {
                        return null; // skip other future tasks
                    }

                    return new ReminderResponse(
                            task.getId(),
                            task.getTitle(),
                            message,
                            task.getDueDate().format(formatter),
                            priority
                    );

                })
                .filter(Objects::nonNull)
                .toList();
    }


}
