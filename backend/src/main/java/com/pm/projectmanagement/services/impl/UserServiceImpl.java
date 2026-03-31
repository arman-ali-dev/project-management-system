package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.config.JwtProvider;
import com.pm.projectmanagement.enums.UserRole;
import com.pm.projectmanagement.enums.UserStatus;
import com.pm.projectmanagement.exceptions.AlreadyExistsException;
import com.pm.projectmanagement.exceptions.NotFoundException;
import com.pm.projectmanagement.models.PasswordSetToken;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.PasswordSetTokenRepository;
import com.pm.projectmanagement.repositories.UserRepository;
import com.pm.projectmanagement.requests.CreateUserRequest;
import com.pm.projectmanagement.services.EmailService;
import com.pm.projectmanagement.services.UserService;
import com.pm.projectmanagement.util.TokenGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordSetTokenRepository passwordSetTokenRepository;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           PasswordSetTokenRepository passwordSetTokenRepository,
                           JwtProvider jwtProvider, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordSetTokenRepository = passwordSetTokenRepository;
        this.jwtProvider = jwtProvider;
        this.emailService = emailService;
    }

    @Override
    public User createUser(CreateUserRequest request) {

        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new AlreadyExistsException(
                    "User already exists with email: " + request.getEmail()
            );
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(UserRole.valueOf(request.getRole()));
        user.setDesignation(request.getDesignation());
        user.setStatus(UserStatus.INACTIVE);

        userRepository.save(user);

        PasswordSetToken token = new PasswordSetToken();

        token.setToken(TokenGenerator.generateToken());
        token.setUser(user);
        token.setExpireTime(LocalDateTime.now().plusHours(24));

        passwordSetTokenRepository.save(token);

        emailService.sendVerificationOtpEmail(request.getEmail(), token.getToken());

        return user;
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
    }

    @Override
    public void deleteUser(Long id) {
        User user = this.getUserById(id);
        userRepository.delete(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public User getUserProfile(String jwt) {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new NotFoundException(
                    "User not found with email: " + email
            );
        }

        return user;
    }


    @Override
    public User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        if (authentication == null || !authentication.isAuthenticated()) {
            throw new NotFoundException("No authenticated user found");
        }

        String username = authentication.getName();
        User user = userRepository.findByEmail(username);

        if (user == null) {
            throw new NotFoundException("User not found with email: " + username);
        }

        return user;
    }

    @Override
    public User updateProfile(User existingUser, User user) {
        System.out.println(user.getProfileImage());
        if (user.getFullName() != null && !user.getFullName().trim().isEmpty()) {
            existingUser.setFullName(user.getFullName());
        }

        if (user.getProfileImage() != null && !user.getProfileImage().trim().isEmpty()) {
            existingUser.setProfileImage(user.getProfileImage());
        }

        if (user.getDesignation() != null && !user.getDesignation().trim().isEmpty()) {
            existingUser.setDesignation(user.getDesignation());
        }

        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            existingUser.setEmail(user.getEmail());
        }

        return userRepository.save(existingUser);
    }

    @Override
    public List<User> getUsersByStatus(UserStatus status) {
        return userRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    @Override
    public List<User> searchUsers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return userRepository.findAll(
                    Sort.by(Sort.Direction.DESC, "createdAt")
            );
        }
        return userRepository.searchUsers(keyword);
    }

}
