package com.smarthire.backend.dto;

import com.smarthire.backend.entity.ApplicationStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateApplicationRequest {
    private String companyName;
    private String role;
    private String jobDescription;
    private String resumeSnapshot;
    private ApplicationStatus status;
    private LocalDate appliedDate;
    private String notes;
}
