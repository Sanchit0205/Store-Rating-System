package com.rating.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.rating.backend.dto.AdminStoreRequest;
import com.rating.backend.dto.AdminUserRequest;
import com.rating.backend.dto.DashboardResponse;
import com.rating.backend.dto.StoreResponse;
import com.rating.backend.dto.UserResponse;
import com.rating.backend.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {

        this.adminService = adminService;

    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {

        return adminService.getDashboard();

    }

    @PostMapping("/users")
    public String createUser(@Valid @RequestBody AdminUserRequest request) {

        return adminService.createUser(request);

    }

    @PostMapping("/stores")
    public String createStore(@Valid @RequestBody AdminStoreRequest request) {

        return adminService.createStore(request);

    }

    @GetMapping("/users")
    public List<UserResponse> getUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String role,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String direction) {

        return adminService.getUsers(name, email, address, role, sortBy, direction);

    }

    @GetMapping("/users/{id}")
    public UserResponse getUser(@PathVariable Long id) {

        return adminService.getUser(id);

    }

    @GetMapping("/stores")
    public List<StoreResponse> getStores(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String direction) {

        return adminService.getStores(name, email, address, sortBy, direction);

    }

}
