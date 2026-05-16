package com.pulse.instragram_clone.util;

import com.pulse.instragram_clone.model.Post;
import com.pulse.instragram_clone.repository.PostRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(PostRepository repository) {
        return args -> {
            // Agar pehle se data hai toh phirse mat dalo
            if (repository.count() == 0) {
                Post post = new Post();
                post.setCaption("Mera Pehla Instagram Clone Post! 🚀");
                post.setImageUrl("https://images.unsplash.com/photo-1611162617474-5b21e879e113");
                post.setLikesCount(100);
                // CreatedAt ko manually set kar dete hain testing ke liye
                // post.setCreatedAt(LocalDateTime.now()); // Agar aapne model mein ye method banaya hai

                repository.save(post);
                System.out.println("Bhai, Database mein dummy post safe ho gaya!");
            }
        };
    }
}
