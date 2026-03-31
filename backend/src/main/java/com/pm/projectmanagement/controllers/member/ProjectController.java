package com.pm.projectmanagement.controllers.member;

import com.pm.projectmanagement.enums.Priority;
import com.pm.projectmanagement.enums.ProjectStatus;
import com.pm.projectmanagement.models.Project;
import com.pm.projectmanagement.models.User;
import com.pm.projectmanagement.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectHandler(@PathVariable Long id) {
        Project project = projectService.getProject(id);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Project>> getAllProjectsHandler(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) Priority priority
    ) {

        if (status != null || priority != null) {
            return new ResponseEntity<>(projectService.filterProjects(status, priority), HttpStatus.OK);
        }

        return new ResponseEntity<>(projectService.getAllProjects(), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchUsers(
            @RequestParam String keyword
    ) {
        List<Project> projects = projectService.searchProjects(keyword);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }


}
