package com.rating.backend.controller;


import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/test")
public class TestController {


    @GetMapping
    public String test(){

        return "JWT Protected API Working";

    }

}