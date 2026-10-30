package com.smarthire.backend.service;

import com.smarthire.backend.dto.DashboardStats;
import com.smarthire.backend.entity.ApplicationStatus;
import com.smarthire.backend.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JobApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public DashboardStats getStats(UUID userId) {
        long total = applicationRepository.countByUserId(userId);
        long applied = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED);
        long screening = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.SCREENING);
        long interviewScheduled = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.INTERVIEW_SCHEDULED);
        long offerReceived = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.OFFER_RECEIVED);
        long rejected = applicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED);

        Double avgScoreRaw = applicationRepository.avgMatchScoreByUserId(userId);
        double avgMatchScore = avgScoreRaw != null ? Math.round(avgScoreRaw * 10.0) / 10.0 : 0.0;

        Instant weekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        long appliedThisWeek = applicationRepository.countByUserIdAndCreatedAtAfter(userId, weekAgo);

        return DashboardStats.builder()
                .total(total)
                .applied(applied)
                .screening(screening)
                .interviewScheduled(interviewScheduled)
                .offerReceived(offerReceived)
                .rejected(rejected)
                .avgMatchScore(avgMatchScore)
                .appliedThisWeek(appliedThisWeek)
                .build();
    }
}
