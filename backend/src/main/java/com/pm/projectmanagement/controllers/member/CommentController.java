package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.requests.CommentRequest;
import com.pm.projectmanagement.responses.CommentResponse;
import com.pm.projectmanagement.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class CommentController {


    private final CommentService commentService;


    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.getCommentsByTask(taskId));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long taskId,
            @RequestBody CommentRequest request,
            Authentication authentication) {

        String email    = authentication.getName();
        String userRole = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        return ResponseEntity.ok(
                commentService.addComment(taskId, email, request, userRole));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long taskId,
            @PathVariable Long commentId,
            Authentication authentication) {

        String email    = authentication.getName();
        String userRole = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        commentService.deleteComment(commentId, email, userRole);
        return ResponseEntity.noContent().build();
    }

}
