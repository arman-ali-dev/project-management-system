package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.requests.LoginUserRequest;
import com.pm.projectmanagement.requests.SetPasswordRequest;
import com.pm.projectmanagement.responses.AuthResponse;
import com.pm.projectmanagement.services.AuthService;
import com.pm.projectmanagement.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/set-password")
    public ResponseEntity<AuthResponse> setPasswordHandler(@RequestBody SetPasswordRequest request) {
        AuthResponse response = authService.setPassword(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginUserRequest request) {
        AuthResponse response = authService.LoginUser(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
