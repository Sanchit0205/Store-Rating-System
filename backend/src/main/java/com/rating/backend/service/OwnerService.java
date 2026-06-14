package com.rating.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rating.backend.dto.OwnerDashboardResponse;
import com.rating.backend.dto.RatingUserResponse;
import com.rating.backend.entity.Rating;
import com.rating.backend.entity.Store;
import com.rating.backend.entity.User;
import com.rating.backend.repository.RatingRepository;
import com.rating.backend.repository.StoreRepository;
import com.rating.backend.repository.UserRepository;

@Service
public class OwnerService {

    private final UserRepository userRepository;

    private final StoreRepository storeRepository;

    private final RatingRepository ratingRepository;

    public OwnerService(
            UserRepository userRepository,
            StoreRepository storeRepository,
            RatingRepository ratingRepository) {

        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.ratingRepository = ratingRepository;

    }

    public OwnerDashboardResponse getDashboard(String email) {

        User owner = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Store store = storeRepository
                .findByOwner(owner)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found for owner"));

        List<RatingUserResponse> ratings = ratingRepository.findByStore(store)
                .stream()
                .map(this::toRatingUserResponse)
                .collect(Collectors.toList());

        return new OwnerDashboardResponse(
                store.getId(),
                store.getName(),
                ratingRepository.averageRatingForStore(store),
                ratings);

    }

    private RatingUserResponse toRatingUserResponse(Rating rating) {

        User user = rating.getUser();

        return new RatingUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAddress(),
                rating.getRating());

    }

}
