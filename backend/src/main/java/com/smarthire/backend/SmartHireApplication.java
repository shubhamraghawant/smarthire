package com.smarthire.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SmartHireApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartHireApplication.class, args);
    }
}
