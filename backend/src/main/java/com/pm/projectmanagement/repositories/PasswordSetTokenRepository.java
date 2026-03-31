package com.pm.projectmanagement.repositories;

import com.pm.projectmanagement.models.PasswordSetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordSetTokenRepository extends JpaRepository<PasswordSetToken, Long> {
    PasswordSetToken findByUserId(Long id);

    Optional<PasswordSetToken> findByToken(String token);
}
