package com.smarthire.backend.dto;

import com.smarthire.backend.entity.ApplicationStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private ApplicationStatus status;
}
