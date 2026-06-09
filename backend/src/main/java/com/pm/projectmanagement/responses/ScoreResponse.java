package com.pm.projectmanagement.responses;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScoreResponse {

    private Long   userId;
    private String fullName;
    private String profileImage;

    private int    totalScore;
    private int    tasksCompleted;
    private int    onTimeCount;
    private int    lateCount;
    private int    earlyCount;
    private double completionRate;

    private List<ProjectScore> projectScores;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProjectScore {
        private Long   projectId;
        private String projectName;
        private int    score;
        private int    tasksCompleted;
        private int    onTimeCount;
        private int    lateCount;
        private int    earlyCount;
    }
}

