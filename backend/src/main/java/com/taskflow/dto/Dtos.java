package com.taskflow.dto;

import com.taskflow.model.*;
import lombok.*;
import java.time.*;
import java.util.List;

// ── Auth DTOs ──────────────────────────────────────────────

@Data @AllArgsConstructor @NoArgsConstructor
class LoginRequest {
    private String email;
    private String password;
}

@Data @AllArgsConstructor @NoArgsConstructor
class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
}

@Data @AllArgsConstructor @NoArgsConstructor
class AuthResponse {
    private String token;
    private UserDto user;
}

// ── User DTOs ──────────────────────────────────────────────

@Data @AllArgsConstructor @NoArgsConstructor
class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String color;

    public static UserDto from(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getColor());
    }
}

@Data @AllArgsConstructor @NoArgsConstructor
class UpdateRoleRequest {
    private String role;
}

// ── Project DTOs ───────────────────────────────────────────

@Data @AllArgsConstructor @NoArgsConstructor
class ProjectRequest {
    private String name;
    private String description;
}

@Data @AllArgsConstructor @NoArgsConstructor
class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private List<UserDto> members;
    private int taskCount;
    private int doneCount;
    private LocalDateTime createdAt;
}

// ── Task DTOs ──────────────────────────────────────────────

@Data @AllArgsConstructor @NoArgsConstructor
class TaskRequest {
    private String title;
    private Long projectId;
    private Long assigneeId;
    private String priority;
    private String status;
    private LocalDate dueDate;
}

@Data @AllArgsConstructor @NoArgsConstructor
class TaskDto {
    private Long id;
    private String title;
    private Long projectId;
    private String projectName;
    private UserDto assignee;
    private String priority;
    private String status;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskDto from(Task t) {
        TaskDto dto = new TaskDto();
        dto.setId(t.getId());
        dto.setTitle(t.getTitle());
        dto.setProjectId(t.getProject().getId());
        dto.setProjectName(t.getProject().getName());
        dto.setAssignee(UserDto.from(t.getAssignee()));
        dto.setPriority(t.getPriority().name());
        dto.setStatus(t.getStatus().name());
        dto.setDueDate(t.getDueDate());
        dto.setCreatedAt(t.getCreatedAt());
        dto.setUpdatedAt(t.getUpdatedAt());
        return dto;
    }
}
