package com.pulse.instragram_clone.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.pulse.instragram_clone.model.Story;
import com.pulse.instragram_clone.model.User;
import com.pulse.instragram_clone.repository.StoryRepository;
import com.pulse.instragram_clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = "http://localhost:5173")
public class StoryController {

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    // 1. Story Fetch karna (Last 24 Hours)
    @GetMapping("/active")
    public List<Story> getActiveStories() {
        LocalDateTime dayAgo = LocalDateTime.now().minusHours(24);
        return storyRepository.findByCreatedAtAfterOrderByCreatedAtDesc(dayAgo);
    }

    // 2. Story Upload karna
    @PostMapping("/upload")
    public Story uploadStory(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") String email) {
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) throw new RuntimeException("User nahi mila!");

            // Cloudinary upload
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));

            String imageUrl = (String) uploadResult.get("url");

            Story story = new Story();
            story.setImageUrl(imageUrl);
            story.setUser(user);
            story.setCreatedAt(LocalDateTime.now());

            return storyRepository.save(story);
        } catch (Exception e) {
            throw new RuntimeException("Story upload fail: " + e.getMessage());
        }
    }
}