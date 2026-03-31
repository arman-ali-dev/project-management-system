package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfileHandler(@RequestHeader("Authorization") String jwt) {
        User user = userService.getUserProfile(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUserProfileHandler(
            @RequestHeader("Authorization") String jwt
            , @RequestBody User user) {
        User existingUser = userService.getUserProfile(jwt);
        User updateProfile = userService.updateProfile(existingUser, user);

        return new ResponseEntity<>(updateProfile, HttpStatus.OK);
    }

}
