package com.pulse.instragram_clone.controller;

import com.pulse.instragram_clone.model.User;
import com.pulse.instragram_clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Galti: Email pehle se maujood hai!");
        }

        // Password encrypt karke save kar rahe hain
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        // Debugging ke liye: IntelliJ ke console mein check karna kya print ho raha hai
        System.out.println("Login attempt for email: " + email);

        User user = userRepository.findByEmail(email);

        if (user != null) {
            // Password match kar rahe hain (BCrypt check)
            if (passwordEncoder.matches(password, user.getPassword())) {
                System.out.println("Login successful for: " + email);
                return ResponseEntity.ok(user);
            } else {
                System.out.println("Password mismatch for: " + email);
                return ResponseEntity.status(401).body("Galti: Password sahi nahi hai.");
            }
        }

        System.out.println("User not found in database for email: " + email);
        return ResponseEntity.status(401).body("Galti: User nahi mila!");
    }
}