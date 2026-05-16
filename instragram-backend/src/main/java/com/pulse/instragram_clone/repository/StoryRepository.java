package com.pulse.instragram_clone.repository;

import com.pulse.instragram_clone.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    // 24 ghante ke andar wali stories fetch karne ke liye
    List<Story> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime time);
}
