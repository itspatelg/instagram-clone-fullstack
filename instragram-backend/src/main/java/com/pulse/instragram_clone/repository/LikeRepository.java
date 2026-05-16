package com.pulse.instragram_clone.repository;

import com.pulse.instragram_clone.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    // Ye check karne ke liye ki kya user ne pehle se like kiya hai
    Optional<Like> findByUsernameAndPostId(String username, Long postId);

    // Ye count karne ke liye ki ek post par kitne likes hain
    long countByPostId(Long postId);
}