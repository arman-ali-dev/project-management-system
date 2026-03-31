package com.pm.projectmanagement.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreatedResponse {
    private String passwordSetToken;
    private String message;
}
