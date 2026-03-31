package com.pm.projectmanagement.controllers.admin;

import com.pm.projectmanagement.models.Project;
import com.pm.projectmanagement.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectService projectService;

    @Autowired
    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }


    @PostMapping
    public ResponseEntity<Project> createProjectHandler(@RequestBody Project project) {
        Project createdProject = projectService.createProject(project);
        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProjectHandler(@RequestBody Project project, @PathVariable Long id) {
        Project createdProject = projectService.updateProject(id, project);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProjectHandler(@PathVariable Long id) {
        projectService.deleteProject(id);
        return new ResponseEntity<>("Project deleted successfully!", HttpStatus.OK);
    }


}
