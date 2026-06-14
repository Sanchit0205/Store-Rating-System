package com.rating.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rating.backend.dto.PasswordUpdateRequest;
import com.rating.backend.dto.StoreResponse;
import com.rating.backend.entity.Rating;
import com.rating.backend.entity.Store;
import com.rating.backend.entity.User;
import com.rating.backend.repository.RatingRepository;
import com.rating.backend.repository.StoreRepository;
import com.rating.backend.repository.UserRepository;

import jakarta.persistence.criteria.Predicate;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final StoreRepository storeRepository;

    private final RatingRepository ratingRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            StoreRepository storeRepository,
            RatingRepository ratingRepository,
            BCryptPasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.ratingRepository = ratingRepository;
        this.passwordEncoder = passwordEncoder;

    }

    public String updatePassword(String email, PasswordUpdateRequest request) {

        User user = getUser(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password updated successfully";

    }

    public List<StoreResponse> getStores(
            String userEmail,
            String name,
            String address,
            String sortBy,
            String direction) {

        User user = getUser(userEmail);
        Sort sort = buildSort(sortBy, direction);

        List<Store> stores = storeRepository.findAll((root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (hasText(name)) {
                predicates.add(builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (hasText(address)) {
                predicates.add(builder.like(builder.lower(root.get("address")), "%" + address.toLowerCase() + "%"));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        }, sort);

        return stores.stream()
                .map(store -> toStoreResponse(store, user))
                .collect(Collectors.toList());

    }

    public StoreResponse rateStore(String userEmail, Long storeId, Integer value) {

        User user = getUser(userEmail);
        Store store = storeRepository
                .findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        Rating rating = ratingRepository
                .findByUserAndStore(user, store)
                .orElseGet(Rating::new);

        rating.setUser(user);
        rating.setStore(store);
        rating.setRating(value);

        ratingRepository.save(rating);

        return toStoreResponse(store, user);

    }

    private StoreResponse toStoreResponse(Store store, User user) {

        Integer userRating = ratingRepository.findByUserAndStore(user, store)
                .map(Rating::getRating)
                .orElse(null);

        return new StoreResponse(
                store.getId(),
                store.getName(),
                store.getEmail(),
                store.getAddress(),
                ratingRepository.averageRatingForStore(store),
                userRating,
                store.getOwner() == null ? null : store.getOwner().getName());

    }

    private User getUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    }

    private Sort buildSort(String sortBy, String direction) {

        String field = List.of("name", "address", "email").contains(sortBy) ? sortBy : "name";
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        return Sort.by(sortDirection, field);

    }

    private boolean hasText(String value) {

        return value != null && !value.isBlank();

    }

}
