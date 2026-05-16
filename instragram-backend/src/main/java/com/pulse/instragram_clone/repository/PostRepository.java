package com.pulse.instragram_clone.repository;

import com.pulse.instragram_clone.model.Post;
import com.pulse.instragram_clone.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Personalized Feed with Pagination
    @Query("SELECT p FROM Post p WHERE p.user IN (SELECT f.following FROM Follower f WHERE f.follower = :user) ORDER BY p.createdAt DESC")
    Page<Post> findPostsByFollowedUsers(@Param("user") User user, Pageable pageable);

    // Explore page with Pagination
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Specific user ki profile ke liye (Ye abhi List hi rehne dete hain profile grid ke liye)
    java.util.List<Post> findByUserEmailOrderByCreatedAtDesc(String email);
}