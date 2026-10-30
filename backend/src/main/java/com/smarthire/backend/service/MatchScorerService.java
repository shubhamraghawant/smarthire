package com.smarthire.backend.service;

import com.smarthire.backend.dto.AnalyzeResponse;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class MatchScorerService {

    private static final Set<String> STOPWORDS = Set.of(
            "a", "an", "the", "in", "of", "for", "with", "and", "or",
            "to", "is", "are", "that", "this", "we", "you", "be", "as",
            "at", "on", "by", "from", "our", "your", "will", "have",
            "has", "had", "not", "but", "can", "all", "was", "were",
            "they", "their", "its", "it", "do", "if", "so", "such",
            "use", "used", "using", "may", "also", "both", "any"
    );

    private static final Pattern NON_WORD = Pattern.compile("[^a-zA-Z0-9]+");

    public AnalyzeResponse analyze(String jobDescription, String resumeSnapshot) {
        if (jobDescription == null || jobDescription.isBlank()) {
            return AnalyzeResponse.builder()
                    .matchScore(0)
                    .matchedSkills(Collections.emptyList())
                    .missingSkills(Collections.emptyList())
                    .suggestion("No job description provided for analysis.")
                    .build();
        }
        if (resumeSnapshot == null || resumeSnapshot.isBlank()) {
            return AnalyzeResponse.builder()
                    .matchScore(0)
                    .matchedSkills(Collections.emptyList())
                    .missingSkills(Collections.emptyList())
                    .suggestion("No resume snapshot provided. Add your resume text for AI analysis.")
                    .build();
        }

        // Extract keywords with frequency from job description
        Map<String, Long> jobKeywordFreq = extractKeywordFrequency(jobDescription);
        Set<String> jobKeywords = jobKeywordFreq.keySet();

        // Extract keywords from resume
        Set<String> resumeKeywords = extractKeywords(resumeSnapshot);

        // Matched = intersection
        List<String> matchedSkills = jobKeywords.stream()
                .filter(resumeKeywords::contains)
                .sorted()
                .collect(Collectors.toList());

        // Missing = job keywords not in resume, sorted by frequency descending, top 10
        List<String> missingSkills = jobKeywords.stream()
                .filter(k -> !resumeKeywords.contains(k))
                .sorted(Comparator.comparingLong((String k) -> jobKeywordFreq.getOrDefault(k, 0L)).reversed())
                .limit(10)
                .collect(Collectors.toList());

        // Score
        int score = jobKeywords.isEmpty() ? 0 :
                (int) Math.min(100, Math.round((double) matchedSkills.size() / jobKeywords.size() * 100));

        // Suggestion
        String suggestion;
        if (score >= 70) {
            suggestion = "Strong match! Your profile aligns well with this role.";
        } else if (score >= 40) {
            String top3 = missingSkills.stream().limit(3).collect(Collectors.joining(", "));
            suggestion = "Moderate match. Consider highlighting: " + (top3.isEmpty() ? "relevant skills" : top3);
        } else {
            String top5 = missingSkills.stream().limit(5).collect(Collectors.joining(", "));
            suggestion = "Low match. Focus on acquiring: " + (top5.isEmpty() ? "skills from the job description" : top5);
        }

        return AnalyzeResponse.builder()
                .matchScore(score)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .suggestion(suggestion)
                .build();
    }

    private Map<String, Long> extractKeywordFrequency(String text) {
        String[] tokens = NON_WORD.split(text.toLowerCase());
        Map<String, Long> freq = new LinkedHashMap<>();
        for (String token : tokens) {
            if (token.length() >= 3 && !STOPWORDS.contains(token)) {
                freq.merge(token, 1L, Long::sum);
            }
        }
        return freq;
    }

    private Set<String> extractKeywords(String text) {
        String[] tokens = NON_WORD.split(text.toLowerCase());
        Set<String> keywords = new LinkedHashSet<>();
        for (String token : tokens) {
            if (token.length() >= 3 && !STOPWORDS.contains(token)) {
                keywords.add(token);
            }
        }
        return keywords;
    }
}
