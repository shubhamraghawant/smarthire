package com.smarthire.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeResponse {
    private int matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String suggestion;
}
