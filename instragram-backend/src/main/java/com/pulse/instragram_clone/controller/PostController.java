package com.pulse.instragram_clone.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.pulse.instragram_clone.model.Post;
import com.pulse.instragram_clone.model.User;
import com.pulse.instragram_clone.model.Notification;
import com.pulse.instragram_clone.repository.PostRepository;
import com.pulse.instragram_clone.repository.UserRepository;
import com.pulse.instragram_clone.repository.FollowerRepository;
import com.pulse.instragram_clone.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowerRepository followerRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private Cloudinary cloudinary;

    // --- PAGINATED EXPLORE PAGE ---
    @GetMapping("/all")
    public Map<String, Object> getAllPosts(
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        User currentUser = (email != null) ? userRepository.findByEmail(email) : null;
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(pageable);

        List<Map<String, Object>> postList = postPage.getContent().stream().map(post -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", post.getId());
            map.put("imageUrl", post.getImageUrl());
            map.put("caption", post.getCaption());
            map.put("user", post.getUser());
            map.put("likesCount", post.getLikesCount() != null ? post.getLikesCount() : 0);
            map.put("comments", post.getComments());

            boolean isFollowed = false;
            if (currentUser != null && post.getUser() != null) {
                isFollowed = followerRepository.existsByFollowerAndFollowing(currentUser, post.getUser());
            }
            map.put("followedByCurrentUser", isFollowed);

            return map;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", postList);
        response.put("isLast", postPage.isLast());
        return response;
    }

    // --- PAGINATED FEED ---
    @GetMapping("/feed")
    public Map<String, Object> getFollowedFeed(
            @RequestParam String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        User currentUser = userRepository.findByEmail(email);
        if (currentUser == null) throw new RuntimeException("User nahi mila!");

        Pageable pageable = PageRequest.of(page, size);
        Page<Post> feedPage = postRepository.findPostsByFollowedUsers(currentUser, pageable);

        // Agar followings ki koi post nahi hai (Page 0 par), toh global fetch karo
        if (feedPage.isEmpty() && page == 0) {
            feedPage = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        List<Map<String, Object>> postList = feedPage.getContent().stream().map(post -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", post.getId());
            map.put("imageUrl", post.getImageUrl());
            map.put("caption", post.getCaption());
            map.put("user", post.getUser());
            map.put("likesCount", post.getLikesCount() != null ? post.getLikesCount() : 0);
            map.put("comments", post.getComments());
            map.put("followedByCurrentUser", true);
            return map;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", postList);
        response.put("isLast", feedPage.isLast());
        return response;
    }

    @PostMapping("/create")
    public Post createPost(
            @RequestParam("file") MultipartFile file,
            @RequestParam("caption") String caption,
            @RequestParam("email") String email) {

        try {
            User user = userRepository.findByEmail(email);
            if (user == null) throw new RuntimeException("Bhai user nahi mila!");

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));

            String publicUrl = (String) uploadResult.get("url");

            Post post = new Post();
            post.setImageUrl(publicUrl);
            post.setCaption(caption);
            post.setUser(user);
            post.setLikesCount(0);
            post.setCreatedAt(java.time.LocalDateTime.now());

            return postRepository.save(post);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Cloudinary upload mein locha ho gaya: " + e.getMessage());
        }
    }

    @PostMapping("/{postId}/toggle-like")
    public Post toggleLike(@PathVariable Long postId, @RequestBody Map<String, Object> request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post gayab hai!"));

        String currentUserEmail = (String) request.get("email");
        User currentUser = userRepository.findByEmail(currentUserEmail);

        boolean isAlreadyLiked = request.containsKey("isLiked") && (boolean) request.get("isLiked");

        if (post.getLikesCount() == null) post.setLikesCount(0);

        if (isAlreadyLiked) {
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
        } else {
            post.setLikesCount(post.getLikesCount() + 1);

            if (currentUser != null && post.getUser() != null && !post.getUser().getEmail().equals(currentUserEmail)) {
                notificationRepository.save(new Notification(
                        post.getUser().getEmail(),
                        currentUser.getUsername(),
                        "LIKE",
                        currentUser.getUsername() + " liked your post."
                ));
            }
        }

        return postRepository.save(post);
    }
}