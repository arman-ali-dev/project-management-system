package com.pm.projectmanagement.services;

import com.pm.projectmanagement.enums.UserStatus;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.requests.CreateUserRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserService {
    User createUser(CreateUserRequest request);

    User getUserById(Long id);

    void deleteUser(Long id);

    List<User> getAllUsers();

    User getUserProfile(String jwt);

    User getLoggedInUser();

    User updateProfile(User existingUser, User user);

    List<User> getUsersByStatus(UserStatus status);

    List<User> searchUsers(String keyword);
}
