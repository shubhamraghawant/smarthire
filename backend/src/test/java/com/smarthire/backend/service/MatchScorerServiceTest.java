package com.smarthire.backend.service;

import com.smarthire.backend.dto.AnalyzeResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MatchScorerServiceTest {

    private MatchScorerService service;

    @BeforeEach
    void setUp() {
        service = new MatchScorerService();
    }

    @Test
    void shouldReturnHighScoreForStrongMatch() {
        String jd = "We need a Java Spring Boot developer with Kafka PostgreSQL Docker Kubernetes AWS experience";
        String resume = "I am a Java Spring Boot engineer with Kafka PostgreSQL Docker Kubernetes AWS skills";
        AnalyzeResponse result = service.analyze(jd, resume);
        assertThat(result.getMatchScore()).isGreaterThan(60);
    }

    @Test
    void shouldReturnLowScoreForNoMatch() {
        String jd = "Python Django machine learning TensorFlow data science";
        String resume = "Java Spring Boot Kafka PostgreSQL Docker microservices";
        AnalyzeResponse result = service.analyze(jd, resume);
        assertThat(result.getMatchScore()).isLessThan(30);
    }

    @Test
    void shouldReturnEmptyMatchedSkillsForNoOverlap() {
        String jd = "Ruby Rails Heroku Redis sidekiq";
        String resume = "Java Spring Boot PostgreSQL Docker Kubernetes";
        AnalyzeResponse result = service.analyze(jd, resume);
        assertThat(result.getMatchedSkills()).isEmpty();
    }

    @Test
    void shouldHaveSuggestion() {
        String jd = "Java Spring Boot Kafka";
        String resume = "Python Django Flask";
        AnalyzeResponse result = service.analyze(jd, resume);
        assertThat(result.getSuggestion()).isNotBlank();
    }
}
