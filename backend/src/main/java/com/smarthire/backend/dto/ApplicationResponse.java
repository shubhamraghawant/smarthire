package com.smarthire.backend.dto;

import com.smarthire.backend.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private String companyName;
    private String role;
    private String jobDescription;
    private String resumeSnapshot;
    private ApplicationStatus status;
    private LocalDate appliedDate;
    private String notes;
    private Integer matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private Instant createdAt;
    private Instant updatedAt;
}
