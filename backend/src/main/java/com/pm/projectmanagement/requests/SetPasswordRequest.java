package com.pm.projectmanagement.requests;

import lombok.Data;

@Data
public class SetPasswordRequest {
    private String token;
    private String password;
}
