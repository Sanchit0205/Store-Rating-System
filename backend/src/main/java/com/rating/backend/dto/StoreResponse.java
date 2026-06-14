package com.rating.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StoreResponse {

    private Long id;

    private String name;

    private String email;

    private String address;

    private Double rating;

    private Integer userRating;

    private String ownerName;

}
