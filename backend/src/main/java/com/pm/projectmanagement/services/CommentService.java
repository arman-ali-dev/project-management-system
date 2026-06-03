package com.pm.projectmanagement.services;


import com.pm.projectmanagement.requests.CommentRequest;
import com.pm.projectmanagement.responses.CommentResponse;

import java.util.List;

public interface CommentService {
    List<CommentResponse> getCommentsByTask(Long taskId);

    CommentResponse addComment(Long taskId, String userEmail,
                               CommentRequest request, String userRole);

    void deleteComment(Long commentId, String userEmail, String userRole);
}