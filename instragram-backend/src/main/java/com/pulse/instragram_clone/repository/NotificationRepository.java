package com.pulse.instragram_clone.repository;

import com.pulse.instragram_clone.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverEmailOrderByCreatedAtDesc(String email);
}
