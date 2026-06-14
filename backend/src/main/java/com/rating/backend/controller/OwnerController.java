package com.rating.backend.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.*;

import com.rating.backend.dto.OwnerDashboardResponse;
import com.rating.backend.service.OwnerService;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {

        this.ownerService = ownerService;

    }

    @GetMapping("/dashboard")
    public OwnerDashboardResponse dashboard(Principal principal) {

        return ownerService.getDashboard(principal.getName());

    }

}
