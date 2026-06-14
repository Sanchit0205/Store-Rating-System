package com.rating.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RatingUserResponse {

    private Long userId;

    private String name;

    private String email;

    private String address;

    private Integer rating;

}
