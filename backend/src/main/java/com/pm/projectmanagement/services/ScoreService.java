package com.pm.projectmanagement.services;

import com.pm.projectmanagement.models.Task;
import com.pm.projectmanagement.responses.ScoreResponse;

import java.util.List;

public interface ScoreService {
    ScoreResponse getScoreForUser(Long userId);

    List<ScoreResponse> getAllScores();

    int calculateTaskScore(Task task);
}
