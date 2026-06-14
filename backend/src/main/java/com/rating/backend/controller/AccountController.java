package com.rating.backend.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rating.backend.dto.PasswordUpdateRequest;
import com.rating.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final UserService userService;

    public AccountController(UserService userService) {

        this.userService = userService;

    }

    @PatchMapping("/password")
    public String updatePassword(
            Principal principal,
            @Valid @RequestBody PasswordUpdateRequest request) {

        return userService.updatePassword(principal.getName(), request);

    }

}
