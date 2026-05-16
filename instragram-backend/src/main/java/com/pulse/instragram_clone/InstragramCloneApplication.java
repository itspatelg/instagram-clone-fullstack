package com.pulse.instragram_clone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean; // Naya Import
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate; // Naya Import

@SpringBootApplication
@ComponentScan(basePackages = {"com.pulse.instragram_clone"})
@EntityScan(basePackages = {"com.pulse.instragram_clone.model"})
@EnableJpaRepositories(basePackages = {"com.pulse.instragram_clone.repository"})
public class InstragramCloneApplication {

	public static void main(String[] args) {
		SpringApplication.run(InstragramCloneApplication.class, args);
	}

	// --- YE BEAN ZAROORI HAI AI CHAT KE LIYE ---
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}
