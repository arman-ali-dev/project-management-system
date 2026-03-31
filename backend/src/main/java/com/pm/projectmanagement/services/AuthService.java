package com.pm.projectmanagement.services;

import com.pm.projectmanagement.requests.LoginUserRequest;
import com.pm.projectmanagement.requests.SetPasswordRequest;
import com.pm.projectmanagement.responses.AuthResponse;

public interface AuthService {
    AuthResponse setPassword(SetPasswordRequest request);

    AuthResponse LoginUser(LoginUserRequest request);
}
