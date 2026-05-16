package com.pulse.instragram_clone.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data // Isse Getter/Setter apne aap ban jayenge
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Check karne ke liye ki story 24 ghante purani toh nahi
    public boolean isExpired() {
        return createdAt.isBefore(LocalDateTime.now().minusHours(24));
    }
}
