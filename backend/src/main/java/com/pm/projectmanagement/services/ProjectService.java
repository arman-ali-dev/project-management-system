package com.pm.projectmanagement.services;


import com.pm.projectmanagement.enums.Priority;
import com.pm.projectmanagement.enums.ProjectStatus;
import com.pm.projectmanagement.models.Project;

import java.util.List;

public interface ProjectService {
    Project createProject(Project project);

    Project getProject(Long id);

    Project updateProject(Long id, Project project);

    void deleteProject(Long id);

    List<Project> getAllProjects();

    List<Project> filterProjects(ProjectStatus status, Priority priority);

    List<Project> searchProjects(String keyword);
}
