package com.pulse.instragram_clone.model;

public class LoginRequest {
    private String username;
    private String password;

    // Khali constructor (Spring Boot ko chahiye hota hai)
    public LoginRequest() {
    }

    // Manual Getters and Setters (Lombok ke bharose mat raho)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}