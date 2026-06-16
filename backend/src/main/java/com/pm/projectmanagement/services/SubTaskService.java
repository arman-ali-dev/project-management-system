package com.pm.projectmanagement.services;

import com.pm.projectmanagement.requests.SubTaskRequest;
import com.pm.projectmanagement.responses.SubTaskResponse;

import java.util.List;

public interface SubTaskService {
    List<SubTaskResponse> getSubtasks(Long taskId);

    SubTaskResponse addSubtask(Long taskId, SubTaskRequest request, String userRole);

    SubTaskResponse toggleComplete(Long subtaskId, String userEmail, String userRole);

    void deleteSubtask(Long subtaskId, String userRole);

    SubTaskResponse updateSubtask(Long subtaskId, SubTaskRequest request, String userRole);
}