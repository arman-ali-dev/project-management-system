package com.pm.projectmanagement.requests;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubTaskRequest {
    private String title;
    private Long   assignedToId;   // optional — null allowed
}