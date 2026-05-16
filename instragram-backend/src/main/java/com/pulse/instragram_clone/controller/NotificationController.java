package com.pulse.instragram_clone.controller;

import com.pulse.instragram_clone.model.Notification;
import com.pulse.instragram_clone.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> getNotifications(@RequestParam String email) {
        return notificationRepository.findByReceiverEmailOrderByCreatedAtDesc(email);
    }
}
