package com.pulse.instragram_clone.controller;

import org.springframework.beans.factory.annotation.Value; // Naya Import
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    // Ab key code me directly hardcoded nahi hai, application.yml se dynamically inject hogi
    @Value("${gemini.api.key}")
    private String API_KEY;

    @PostMapping("/ask")
    public Map<String, String> askAI(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Aaj ki sahi date dynamically nikalne ke liye
            String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));

            // System instruction jo AI ko sahi saal aur context batayegi (AnkAI Setup)
            Map<String, Object> systemInstruction = Map.of(
                    "parts", List.of(Map.of("text",
                            "You are AnkAI, a helpful assistant integrated into an Instagram clone. " +
                                    "The current year is 2026. Today's dynamic date is " + currentDate + ". " +
                                    "Do not assume the year is 2024. Provide updated answers based on the year 2026."))
            );

            Map<String, Object> textMap = Map.of("text", prompt);
            Map<String, Object> partsMap = Map.of("parts", List.of(textMap));

            // Pura payload configuration system instruction ke saath
            Map<String, Object> payload = new HashMap<>();
            payload.put("contents", List.of(partsMap));
            payload.put("systemInstruction", systemInstruction);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            // API_KEY variable use ho raha hai jo config se aa raha hai
            String finalUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

            ResponseEntity<Map> response = restTemplate.exchange(finalUrl, HttpMethod.POST, entity, Map.class);

            if (response.getBody() != null) {
                List candidates = (List) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map content = (Map) firstCandidate.get("content");
                    List parts = (List) content.get("parts");
                    Map firstPart = (Map) parts.get(0);
                    String aiAnswer = (String) firstPart.get("text");

                    return Map.of("answer", aiAnswer);
                }
            }

            return Map.of("answer", "Bhai, Google ne response blank diya.");

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("answer", "Locha: " + e.getMessage());
        }
    }
}
