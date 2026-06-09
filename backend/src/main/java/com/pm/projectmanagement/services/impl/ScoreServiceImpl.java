package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.enums.TaskStatus;
import com.pm.projectmanagement.models.Task;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.TaskRepository;
import com.pm.projectmanagement.repositories.UserRepository;
import com.pm.projectmanagement.responses.ScoreResponse;
import com.pm.projectmanagement.services.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ScoreServiceImpl implements ScoreService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private static final int BASE_SCORE = 100;
    private static final int EARLY_BONUS = 10;
    private static final int MAX_EARLY_BONUS = 30;
    private static final int LATE_PENALTY = 15;


    @Autowired
    public ScoreServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }


    @Override
    public ScoreResponse getScoreForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        List<Task> allTasks = taskRepository.findByAssignedToId(userId);
        List<Task> completed = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE && t.getCompletedAt() != null)
                .toList();

        int totalScore = 0;
        int onTimeCount = 0;
        int lateCount = 0;
        int earlyCount = 0;

        Map<Long, List<Task>> byProject = completed.stream()
                .filter(t -> t.getProject() != null)
                .collect(Collectors.groupingBy(t -> t.getProject().getId()));

        List<ScoreResponse.ProjectScore> projectScores = new ArrayList<>();

        for (Map.Entry<Long, List<Task>> entry : byProject.entrySet()) {
            int pScore = 0;
            int pOnTime = 0;
            int pLate = 0;
            int pEarly = 0;
            String pName = entry.getValue().get(0).getProject().getName();

            for (Task task : entry.getValue()) {
                int s = calculateTaskScore(task);
                pScore += s;

                int diff = dayDiff(task);
                if (diff < 0) {
                    pEarly++;
                    earlyCount++;
                } else if (diff == 0) {
                    pOnTime++;
                    onTimeCount++;
                } else {
                    pLate++;
                    lateCount++;
                }
            }

            totalScore += pScore;

            projectScores.add(ScoreResponse.ProjectScore.builder()
                    .projectId(entry.getKey())
                    .projectName(pName)
                    .score(pScore)
                    .tasksCompleted(entry.getValue().size())
                    .onTimeCount(pOnTime)
                    .lateCount(pLate)
                    .earlyCount(pEarly)
                    .build());
        }

        projectScores.sort(Comparator.comparingInt(ScoreResponse.ProjectScore::getScore).reversed());

        double completionRate = allTasks.isEmpty() ? 0 :
                Math.round((completed.size() * 100.0 / allTasks.size()) * 10.0) / 10.0;

        return ScoreResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .profileImage(user.getProfileImage())
                .totalScore(totalScore)
                .tasksCompleted(completed.size())
                .onTimeCount(onTimeCount)
                .lateCount(lateCount)
                .earlyCount(earlyCount)
                .completionRate(completionRate)
                .projectScores(projectScores)
                .build();
        }

        @Override
        public List<ScoreResponse> getAllScores () {
            List<User> users = userRepository.findAll();
            return users.stream()
                    .map(u -> getScoreForUser(u.getId()))
                    .sorted(Comparator.comparingInt(ScoreResponse::getTotalScore).reversed())
                    .collect(Collectors.toList());
        }

        @Override
        public int calculateTaskScore (Task task){
            int diff  = dayDiff(task);
            int score = BASE_SCORE;

            if (diff < 0) {
                int bonus = Math.min(Math.abs(diff) * EARLY_BONUS, MAX_EARLY_BONUS);
                score += bonus;
            } else if (diff > 0) {
                int penalty = diff * LATE_PENALTY;
                score = Math.max(0, score - penalty);
            }

            return score;
        }

    private int dayDiff(Task task) {
        LocalDate completedDate = task.getCompletedAt().toLocalDate();
        LocalDate dueDate       = task.getDueDate();
        return (int) java.time.temporal.ChronoUnit.DAYS.between(dueDate, completedDate);
    }
    }
