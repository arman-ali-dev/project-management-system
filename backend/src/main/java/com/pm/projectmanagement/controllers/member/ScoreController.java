package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.responses.ScoreResponse;
import com.pm.projectmanagement.services.ScoreService;
import com.pm.projectmanagement.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
public class ScoreController {

    private final ScoreService scoreService;
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ScoreResponse> getMyScore(@RequestHeader("Authorization") String jwt) {
        User user = userService.getUserProfile(jwt);
        return ResponseEntity.ok(scoreService.getScoreForUser(user.getId()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ScoreResponse> getUserScore(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String jwt) {

        User user = userService.getUserProfile(jwt);
        if (!"ADMIN".equalsIgnoreCase(String.valueOf(user.getRole()))) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(scoreService.getScoreForUser(userId));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<ScoreResponse>> getLeaderboard(@RequestHeader("Authorization") String jwt) {
        User user = userService.getUserProfile(jwt);
        if (!"ADMIN".equalsIgnoreCase(String.valueOf(user.getRole()))) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(scoreService.getAllScores());
    }


}