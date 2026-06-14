package com.rating.backend.controller;


import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/user")
public class RoleTestController {


    @GetMapping("/test")
    public String userAccess(){

        return "USER API ACCESS GRANTED";

    }

}