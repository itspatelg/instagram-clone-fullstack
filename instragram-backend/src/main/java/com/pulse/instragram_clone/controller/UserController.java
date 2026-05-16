package com.pulse.instragram_clone.controller;

import com.pulse.instragram_clone.model.User;
import com.pulse.instragram_clone.model.Post;
import com.pulse.instragram_clone.model.Follower;
import com.pulse.instragram_clone.model.Notification; // Add this
import com.pulse.instragram_clone.repository.UserRepository;
import com.pulse.instragram_clone.repository.PostRepository;
import com.pulse.instragram_clone.repository.FollowerRepository;
import com.pulse.instragram_clone.repository.NotificationRepository; // Add this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FollowerRepository followerRepository;

    @Autowired
    private NotificationRepository notificationRepository; // Injected

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String username, @RequestParam String currentUserEmail) {
        User user = userRepository.findByUsername(username);
        User currentUser = userRepository.findByEmail(currentUserEmail);

        if (user == null) {
            return ResponseEntity.status(404).body("Bhai, ye user database mein nahi mila!");
        }

        List<Post> posts = postRepository.findByUserEmailOrderByCreatedAtDesc(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("bio", user.getBio());
        response.put("profilePictureUrl", user.getProfilePictureUrl());
        response.put("posts", posts);
        response.put("postsCount", posts.size());
        response.put("followersCount", followerRepository.countByFollowing(user));
        response.put("followingCount", followerRepository.countByFollower(user));

        boolean isFollowed = false;
        if (currentUser != null) {
            isFollowed = followerRepository.existsByFollowerAndFollowing(currentUser, user);
        }
        response.put("isFollowed", isFollowed);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateUserProfile(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String fullName = request.get("fullName");
        String bio = request.get("bio");
        String profilePictureUrl = request.get("profilePictureUrl");

        User user = userRepository.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("User nahi mila!");

        if (fullName != null && !fullName.isEmpty()) user.setFullName(fullName);
        if (bio != null) user.setBio(bio);
        if (profilePictureUrl != null && !profilePictureUrl.isEmpty()) user.setProfilePictureUrl(profilePictureUrl);

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/follow")
    public ResponseEntity<?> followUser(@RequestBody Map<String, String> request) {
        String followerEmail = request.get("followerEmail");
        String targetUsername = request.get("followingUsername");

        User followerUser = userRepository.findByEmail(followerEmail);
        User followingUser = userRepository.findByUsername(targetUsername);

        if (followerUser == null || followingUser == null) {
            return ResponseEntity.badRequest().body("User nahi mila!");
        }

        if (followerUser.getEmail().equals(followingUser.getEmail())) {
            return ResponseEntity.badRequest().body("Bhai, khud ko kaise follow karoge?");
        }

        Follower existing = followerRepository.findByFollowerAndFollowing(followerUser, followingUser);

        if (existing != null) {
            followerRepository.delete(existing);
            return ResponseEntity.ok("Unfollowed");
        } else {
            followerRepository.save(new Follower(followerUser, followingUser));

            // NOTIFICATION LOGIC
            notificationRepository.save(new Notification(
                    followingUser.getEmail(),
                    followerUser.getUsername(),
                    "FOLLOW",
                    followerUser.getUsername() + " started following you."
            ));

            return ResponseEntity.ok("Followed");
        }
    }
}
