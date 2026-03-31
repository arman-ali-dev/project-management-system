package com.pm.projectmanagement.requests;

import com.pm.projectmanagement.enums.UserRole;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String fullName;
    private String email;
    private String role;
    private String designation;
}
