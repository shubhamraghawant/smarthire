package com.smarthire.backend.controller;

import com.smarthire.backend.dto.*;
import com.smarthire.backend.entity.ApplicationStatus;
import com.smarthire.backend.repository.UserRepository;
import com.smarthire.backend.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Job Applications", description = "Manage job applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    private UUID getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userDetails.getUsername()))
                .getId();
    }

    @PostMapping
    @Operation(summary = "Create a new job application")
    public ResponseEntity<ApplicationResponse> create(
            @Valid @RequestBody CreateApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.create(getUserId(userDetails), request));
    }

    @GetMapping
    @Operation(summary = "List all applications for the authenticated user")
    public ResponseEntity<PagedResponse<ApplicationResponse>> getAll(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getAll(getUserId(userDetails), status, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single application by ID")
    public ResponseEntity<ApplicationResponse> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getById(id, getUserId(userDetails)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a job application")
    public ResponseEntity<ApplicationResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.update(id, getUserId(userDetails), request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a job application")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        applicationService.delete(id, getUserId(userDetails));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update application status only")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable UUID id,
            @RequestBody UpdateStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.updateStatus(id, getUserId(userDetails), request.getStatus()));
    }

    @PostMapping("/{id}/analyze")
    @Operation(summary = "Analyze resume-JD match and score the application")
    public ResponseEntity<AnalyzeResponse> analyze(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.analyzeMatch(id, getUserId(userDetails)));
    }
}
