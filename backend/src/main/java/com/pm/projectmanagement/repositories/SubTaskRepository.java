package com.pm.projectmanagement.repositories;


import com.pm.projectmanagement.models.SubTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubTaskRepository extends JpaRepository<SubTask, Long> {
    List<SubTask> findByTaskIdOrderByCreatedAtAsc(Long taskId);

    long countByTaskIdAndCompletedTrue(Long taskId);
    long countByTaskId(Long taskId);
}