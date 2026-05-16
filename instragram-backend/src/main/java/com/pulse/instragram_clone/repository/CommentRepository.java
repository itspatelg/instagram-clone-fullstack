package com.pulse.instragram_clone.repository;

import com.pulse.instragram_clone.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Post ID ke hisaab se comments nikalne ke liye
    List<Comment> findByPostId(Long postId);
}