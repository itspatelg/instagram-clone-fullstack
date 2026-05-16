package com.pulse.instragram_clone.repository;

import com.pulse.instragram_clone.model.Follower;
import com.pulse.instragram_clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowerRepository extends JpaRepository<Follower, Long> {

    // Check karne ke liye ki kya pehle se follower hai
    Follower findByFollowerAndFollowing(User follower, User following);

    // Followers count nikalne ke liye
    long countByFollowing(User user);

    // Following count nikalne ke liye
    long countByFollower(User user);

    // Profile page pe 'Following' ya 'Follow' button dikhane ke liye check
    boolean existsByFollowerAndFollowing(User follower, User following);
}