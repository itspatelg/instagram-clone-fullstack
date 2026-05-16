package com.pulse.instragram_clone.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();

        // 1. Cloud Name (Sahi hai)
        config.put("cloud_name", "dsh8k1wn3");

        // 2. API Key (Yahan sirf 15 digit ka number aayega)
        // Tune pura URL daal diya tha, use hata kar sirf ye number likho:
        config.put("api_key", "682436269855855");

        // 3. API Secret (Sahi hai)
        config.put("api_secret", "zeKuNOqNJlskhz3rsyBgXqSdZqs");

        return new Cloudinary(config);
    }
}