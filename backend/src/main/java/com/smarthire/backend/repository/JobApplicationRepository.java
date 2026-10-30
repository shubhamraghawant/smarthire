package com.smarthire.backend.repository;

import com.smarthire.backend.entity.ApplicationStatus;
import com.smarthire.backend.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    Page<JobApplication> findByUserId(UUID userId, Pageable pageable);

    Page<JobApplication> findByUserIdAndStatus(UUID userId, ApplicationStatus status, Pageable pageable);

    long countByUserId(UUID userId);

    long countByUserIdAndStatus(UUID userId, ApplicationStatus status);

    @Query("SELECT AVG(j.matchScore) FROM JobApplication j WHERE j.user.id = :userId AND j.matchScore IS NOT NULL")
    Double avgMatchScoreByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(j) FROM JobApplication j WHERE j.user.id = :userId AND j.createdAt >= :since")
    long countByUserIdAndCreatedAtAfter(@Param("userId") UUID userId, @Param("since") Instant since);
}
