package com.rating.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private long totalUsers;

    private long totalStores;

    private long totalRatings;

}
