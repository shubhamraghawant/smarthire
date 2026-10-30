package com.smarthire.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateApplicationRequest {
    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Role is required")
    private String role;

    private String jobDescription;
    private String resumeSnapshot;
    private LocalDate appliedDate;
    private String notes;
}
