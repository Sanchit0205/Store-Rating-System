package com.rating.backend.controller;

import org.springframework.web.bind.annotation.*;

import com.rating.backend.dto.AuthResponse;
import com.rating.backend.dto.LoginRequest;
import com.rating.backend.dto.RegisterRequest;
import com.rating.backend.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {

        this.authService = authService;

    }

    @GetMapping("/test")
    public String test() {

        return "Auth API Working";

    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {

        return authService.register(request);

    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {

        return authService.login(
                request.getEmail(),
                request.getPassword());

    }

}
