package com.pm.projectmanagement.services.impl;

import com.pm.projectmanagement.config.JwtProvider;
import com.pm.projectmanagement.enums.UserStatus;
import com.pm.projectmanagement.exceptions.InvalidDataException;
import com.pm.projectmanagement.exceptions.NotFoundException;
import com.pm.projectmanagement.exceptions.TokenExpireException;
import com.pm.projectmanagement.models.PasswordSetToken;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.repositories.PasswordSetTokenRepository;
import com.pm.projectmanagement.repositories.UserRepository;
import com.pm.projectmanagement.requests.LoginUserRequest;
import com.pm.projectmanagement.requests.SetPasswordRequest;
import com.pm.projectmanagement.responses.AuthResponse;
import com.pm.projectmanagement.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordSetTokenRepository passwordSetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository,
                           PasswordSetTokenRepository passwordSetTokenRepository,
                           PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordSetTokenRepository = passwordSetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }


    @Override
    public AuthResponse setPassword(SetPasswordRequest request) {

        System.out.println("token " + request.getToken());
        PasswordSetToken token = passwordSetTokenRepository
                .findByToken(request.getToken())
                .orElseThrow(() -> new InvalidDataException("Invalid token"));

        if (token.getExpireTime().isBefore(LocalDateTime.now())) {
            throw new TokenExpireException("Token expired");
        }

        User user = token.getUser();

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        passwordSetTokenRepository.delete(token);


        AuthResponse response = new AuthResponse();
        response.setMessage("Password set successfully!");

        return response;
    }

    @Override
    public AuthResponse LoginUser(LoginUserRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            throw new NotFoundException("User Not Found!");
        }

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidDataException("Invalid email or password!");
        }

        // Build authorities list
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        // Create Authentication object
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);

        // Set authentication context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT
        String jwt = jwtProvider.generateToken(authentication);

        // Return response
        return new AuthResponse(jwt, "Login Successful!", user.getRole());

    }

}
