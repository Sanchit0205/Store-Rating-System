package com.rating.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OwnerDashboardResponse {

    private Long storeId;

    private String storeName;

    private Double averageRating;

    private List<RatingUserResponse> ratings;

}
