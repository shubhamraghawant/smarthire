package com.smarthire.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long total;
    private long applied;
    private long screening;
    private long interviewScheduled;
    private long offerReceived;
    private long rejected;
    private double avgMatchScore;
    private long appliedThisWeek;
}
