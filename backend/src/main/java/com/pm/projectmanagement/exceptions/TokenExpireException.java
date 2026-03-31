package com.pm.projectmanagement.exceptions;


public class TokenExpireException extends RuntimeException {
    public TokenExpireException(String message) {
        super(message);
    }
}
