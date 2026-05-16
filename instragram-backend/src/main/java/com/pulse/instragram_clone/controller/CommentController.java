package com.pulse.instragram_clone.controller;

import com.pulse.instragram_clone.model.Comment;
import com.pulse.instragram_clone.model.Post;
import com.pulse.instragram_clone.model.User;
import com.pulse.instragram_clone.model.Notification;
import com.pulse.instragram_clone.repository.CommentRepository;
import com.pulse.instragram_clone.repository.PostRepository;
import com.pulse.instragram_clone.repository.UserRepository;
import com.pulse.instragram_clone.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Add this
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addComment(@RequestBody Map<String, Object> request) {
        try {
            // 1. Post ID handle karna (Number ya String handle ho jayega)
            Object postIdObj = request.get("postId");
            if (postIdObj == null) return ResponseEntity.badRequest().body("Post ID missing hai!");
            Long postId = Long.valueOf(postIdObj.toString());

            // 2. Text aur Email nikalna
            String text = (String) request.get("text");
            String email = (String) request.get("email");

            if (text == null || text.trim().isEmpty()) return ResponseEntity.badRequest().body("Comment khali nahi ho sakta!");
            if (email == null) return ResponseEntity.badRequest().body("User email missing hai!");

            // 3. User aur Post dhundna
            User user = userRepository.findByEmail(email);
            if (user == null) return ResponseEntity.status(404).body("User database mein nahi mila!");

            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post nahi mili database mein!"));

            // 4. Comment set aur save karna
            Comment comment = new Comment();
            comment.setText(text);
            comment.setPost(post);
            comment.setUser(user);

            Comment savedComment = commentRepository.save(comment);

            // 5. NOTIFICATION LOGIC
            // Sirf tab bhejna jab post owner khud comment na kar raha ho
            if (post.getUser() != null && !post.getUser().getEmail().equals(email)) {
                notificationRepository.save(new Notification(
                        post.getUser().getEmail(),
                        user.getUsername(),
                        "COMMENT",
                        user.getUsername() + " commented: " + text
                ));
            }

            return ResponseEntity.ok(savedComment);

        } catch (Exception e) {
            e.printStackTrace(); // IntelliJ console mein error dekhne ke liye
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getComments(@PathVariable Long postId) {
        return commentRepository.findByPostId(postId);
    }
}