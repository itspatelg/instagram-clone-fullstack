package com.pulse.instragram_clone.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "followers")
public class Follower {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower_id")
    private User follower; // Jo follow kar raha hai

    @ManyToOne
    @JoinColumn(name = "following_id")
    private User following; // Jise follow kiya ja raha hai

    private LocalDateTime createdAt = LocalDateTime.now();

    public Follower() {}

    public Follower(User follower, User following) {
        this.follower = follower;
        this.following = following;
    }

    // Getters and Setters
}
