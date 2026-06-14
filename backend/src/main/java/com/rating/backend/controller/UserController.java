package com.rating.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.rating.backend.dto.PasswordUpdateRequest;
import com.rating.backend.dto.RatingRequest;
import com.rating.backend.dto.StoreResponse;
import com.rating.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {

        this.userService = userService;

    }

    @PatchMapping("/password")
    public String updatePassword(
            Principal principal,
            @Valid @RequestBody PasswordUpdateRequest request) {

        return userService.updatePassword(principal.getName(), request);

    }

    @GetMapping("/stores")
    public List<StoreResponse> getStores(
            Principal principal,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String direction) {

        return userService.getStores(principal.getName(), name, address, sortBy, direction);

    }

    @PutMapping("/stores/{storeId}/rating")
    public StoreResponse rateStore(
            Principal principal,
            @PathVariable Long storeId,
            @Valid @RequestBody RatingRequest request) {

        return userService.rateStore(principal.getName(), storeId, request.getRating());

    }

}
