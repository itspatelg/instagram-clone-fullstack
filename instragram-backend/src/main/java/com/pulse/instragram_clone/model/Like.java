package com.pulse.instragram_clone.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "likes")
@Data
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // Kisne like kiya
    private Long postId;     // Kaunsi post ko like kiya
}
