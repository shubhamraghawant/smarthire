package com.smarthire.backend.service;

import com.smarthire.backend.dto.*;
import com.smarthire.backend.entity.ApplicationStatus;
import com.smarthire.backend.entity.JobApplication;
import com.smarthire.backend.entity.User;
import com.smarthire.backend.repository.JobApplicationRepository;
import com.smarthire.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final MatchScorerService matchScorerService;

    @Transactional
    public ApplicationResponse create(UUID userId, CreateApplicationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        JobApplication application = JobApplication.builder()
                .user(user)
                .companyName(request.getCompanyName())
                .role(request.getRole())
                .jobDescription(request.getJobDescription())
                .resumeSnapshot(request.getResumeSnapshot())
                .appliedDate(request.getAppliedDate())
                .notes(request.getNotes())
                .status(ApplicationStatus.APPLIED)
                .build();

        return toResponse(applicationRepository.save(application));
    }

    @Transactional
    public ApplicationResponse update(UUID id, UUID userId, UpdateApplicationRequest request) {
        JobApplication application = findAndVerifyOwnership(id, userId);

        if (request.getCompanyName() != null) application.setCompanyName(request.getCompanyName());
        if (request.getRole() != null) application.setRole(request.getRole());
        if (request.getJobDescription() != null) application.setJobDescription(request.getJobDescription());
        if (request.getResumeSnapshot() != null) application.setResumeSnapshot(request.getResumeSnapshot());
        if (request.getStatus() != null) application.setStatus(request.getStatus());
        if (request.getAppliedDate() != null) application.setAppliedDate(request.getAppliedDate());
        if (request.getNotes() != null) application.setNotes(request.getNotes());

        return toResponse(applicationRepository.save(application));
    }

    @Transactional
    public ApplicationResponse updateStatus(UUID id, UUID userId, ApplicationStatus status) {
        JobApplication application = findAndVerifyOwnership(id, userId);
        application.setStatus(status);
        return toResponse(applicationRepository.save(application));
    }

    @Transactional
    public void delete(UUID id, UUID userId) {
        JobApplication application = findAndVerifyOwnership(id, userId);
        applicationRepository.delete(application);
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getById(UUID id, UUID userId) {
        return toResponse(findAndVerifyOwnership(id, userId));
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponse> getAll(UUID userId, ApplicationStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<JobApplication> result;

        if (status != null) {
            result = applicationRepository.findByUserIdAndStatus(userId, status, pageable);
        } else {
            result = applicationRepository.findByUserId(userId, pageable);
        }

        List<ApplicationResponse> content = result.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ApplicationResponse>builder()
                .content(content)
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @Transactional
    public AnalyzeResponse analyzeMatch(UUID id, UUID userId) {
        JobApplication application = findAndVerifyOwnership(id, userId);

        AnalyzeResponse result = matchScorerService.analyze(
                application.getJobDescription(),
                application.getResumeSnapshot()
        );

        application.setMatchScore(result.getMatchScore());
        application.setMatchedSkills(String.join(",", result.getMatchedSkills()));
        application.setMissingSkills(String.join(",", result.getMissingSkills()));
        applicationRepository.save(application);

        return result;
    }

    private JobApplication findAndVerifyOwnership(UUID id, UUID userId) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with id: " + id));
        if (!application.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to access this application");
        }
        return application;
    }

    private ApplicationResponse toResponse(JobApplication app) {
        List<String> matchedSkillsList = parseSkills(app.getMatchedSkills());
        List<String> missingSkillsList = parseSkills(app.getMissingSkills());

        return ApplicationResponse.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .userName(app.getUser().getName())
                .companyName(app.getCompanyName())
                .role(app.getRole())
                .jobDescription(app.getJobDescription())
                .resumeSnapshot(app.getResumeSnapshot())
                .status(app.getStatus())
                .appliedDate(app.getAppliedDate())
                .notes(app.getNotes())
                .matchScore(app.getMatchScore())
                .matchedSkills(matchedSkillsList)
                .missingSkills(missingSkillsList)
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }

    private List<String> parseSkills(String skills) {
        if (skills == null || skills.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
