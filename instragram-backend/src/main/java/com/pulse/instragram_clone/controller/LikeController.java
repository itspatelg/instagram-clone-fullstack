package com.pulse.instragram_clone.controller;

import com.pulse.instragram_clone.model.Like;
import com.pulse.instragram_clone.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeRepository likeRepository;

    @PostMapping("/{postId}")
    public String toggleLike(@PathVariable Long postId) {
        // 1. Token se current user nikalo
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Check karo ki kya pehle se like hai?
        Optional<Like> existingLike = likeRepository.findByUsernameAndPostId(username, postId);

        if (existingLike.isPresent()) {
            // Agar pehle se hai toh Unlike kar do (Delete)
            likeRepository.delete(existingLike.get());
            return "Post Unliked!";
        } else {
            // Agar nahi hai toh Like kar do (Save)
            Like like = new Like();
            like.setUsername(username);
            like.setPostId(postId);
            likeRepository.save(like);
            return "Post Liked!";
        }
    }

    @GetMapping("/count/{postId}")
    public long getLikeCount(@PathVariable Long postId) {
        return likeRepository.countByPostId(postId);
    }
}