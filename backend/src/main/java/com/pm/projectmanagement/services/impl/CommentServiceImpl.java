package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.enums.NotificationType;
import com.pm.projectmanagement.models.Comment;
import com.pm.projectmanagement.models.Notification;
import com.pm.projectmanagement.models.Task;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.CommentRepository;
import com.pm.projectmanagement.repositories.NotificationRepository;
import com.pm.projectmanagement.repositories.TaskRepository;
import com.pm.projectmanagement.repositories.UserRepository;
import com.pm.projectmanagement.requests.CommentRequest;
import com.pm.projectmanagement.responses.CommentResponse;
import com.pm.projectmanagement.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    public CommentServiceImpl(CommentRepository commentRepository,
                              TaskRepository taskRepository,
                              UserRepository userRepository,
                              SimpMessagingTemplate messagingTemplate,
                              NotificationRepository notificationRepository) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
        this.notificationRepository = notificationRepository;
    }

    public List<CommentResponse> getCommentsByTask(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse addComment(Long taskId, String userEmail,
                                      CommentRequest request, String userRole) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"));

        User author = userRepository.findByEmail(userEmail);

        if (author == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found");
        }

        boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);

        boolean isAssigned = task.getAssignedTo() != null &&
                task.getAssignedTo()
                        .stream()
                        .anyMatch(u -> u.getId().equals(author.getId()));

        if (!isAdmin && !isAssigned) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins or assigned members can comment on this task");
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .task(task)
                .author(author)
                .build();

        Comment saved = commentRepository.save(comment);

        Map<String, Object> event = new HashMap<>();
        event.put("taskId", task.getId());
        event.put("taskTitle", task.getTitle());
        event.put("commenterName", author.getFullName());
        event.put("content", request.getContent());

        if (task.getAssignedTo() != null) {
            task.getAssignedTo().forEach(assignedUser -> {
                if (assignedUser == null || assignedUser.getId() == null) return;
                if (assignedUser.getId().equals(author.getId())) return;

                Notification notification = Notification.builder()
                        .type(NotificationType.COMMENT)
                        .title("New Comment")
                        .body(author.getFullName() + " commented on \"" + task.getTitle() + "\"")
                        .readStatus(false)
                        .taskId(task.getId())
                        .taskTitle(task.getTitle())
                        .sender(author)
                        .receiver(assignedUser)
                        .build();

                notificationRepository.save(notification);

                messagingTemplate.convertAndSend(
                        "/topic/task-comment/" + assignedUser.getId(),
                        (Object) event
                );
            });
        }

        return toResponse(saved);
    }

    public void deleteComment(Long commentId, String userEmail, String userRole) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Comment not found"));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);
        boolean isAuthor = comment.getAuthor().getEmail().equals(userEmail);

        if (!isAdmin && !isAuthor) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Not authorised to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment c) {
        return CommentResponse.builder()
                .id(c.getId())
                .content(c.getContent())
                .taskId(c.getTask().getId())
                .authorId(c.getAuthor().getId())
                .authorName(c.getAuthor().getFullName())
                .authorImage(c.getAuthor().getProfileImage())
                .createdAt(c.getCreatedAt())
                .build();
    }
}