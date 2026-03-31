package com.pm.projectmanagement.repositories;

import com.pm.projectmanagement.enums.UserStatus;
import com.pm.projectmanagement.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    List<User> findAllByOrderByCreatedAtDesc();

    List<User> findByStatusOrderByCreatedAtDesc(UserStatus status);

    @Query("""
                SELECT u FROM User u
                WHERE
                    LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(u.designation) LIKE LOWER(CONCAT('%', :keyword, '%'))
                ORDER BY u.createdAt DESC
            """)
    List<User> searchUsers(@Param("keyword") String keyword);

}
