package com.pm.projectmanagement.repositories;

import com.pm.projectmanagement.enums.Priority;
import com.pm.projectmanagement.enums.ProjectStatus;
import com.pm.projectmanagement.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderByCreatedAtDesc();

    List<Project> findByStatusOrderByCreatedAtDesc(ProjectStatus status);

    List<Project> findByPriorityOrderByCreatedAtDesc(Priority priority);

    @Query("""
                SELECT p FROM Project p
                WHERE
                    LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(p.organizationName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                ORDER BY p.createdAt DESC
            """)
    List<Project> searchProjects(@Param("keyword") String keyword);
}
