package com.rating.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rating.backend.dto.AdminStoreRequest;
import com.rating.backend.dto.AdminUserRequest;
import com.rating.backend.dto.DashboardResponse;
import com.rating.backend.dto.StoreResponse;
import com.rating.backend.dto.UserResponse;
import com.rating.backend.entity.Role;
import com.rating.backend.entity.Store;
import com.rating.backend.entity.User;
import com.rating.backend.repository.RatingRepository;
import com.rating.backend.repository.StoreRepository;
import com.rating.backend.repository.UserRepository;

import jakarta.persistence.criteria.Predicate;

@Service
public class AdminService {

    private final UserRepository userRepository;

    private final StoreRepository storeRepository;

    private final RatingRepository ratingRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    public AdminService(
            UserRepository userRepository,
            StoreRepository storeRepository,
            RatingRepository ratingRepository,
            BCryptPasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.ratingRepository = ratingRepository;
        this.passwordEncoder = passwordEncoder;

    }

    public DashboardResponse getDashboard() {

        return new DashboardResponse(
                userRepository.count(),
                storeRepository.count(),
                ratingRepository.count());

    }

    public String createUser(AdminUserRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));

        userRepository.save(user);

        return "User created successfully";

    }

    public String createStore(AdminStoreRequest request) {

        User owner = userRepository
                .findById(request.getOwnerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        if (owner.getRole() != Role.OWNER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Store owner must have OWNER role");
        }

        if (storeRepository.findByOwner(owner).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Owner already owns a store");
        }

        Store store = new Store();

        store.setName(request.getName());
        store.setEmail(request.getEmail());
        store.setAddress(request.getAddress());
        store.setOwner(owner);

        storeRepository.save(store);

        return "Store created successfully";

    }

    public List<UserResponse> getUsers(
            String name,
            String email,
            String address,
            String role,
            String sortBy,
            String direction) {

        Sort sort = buildSort(sortBy, direction, List.of("name", "email", "address", "role"));

        List<User> users = userRepository.findAll((root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (hasText(name)) {
                predicates.add(builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (hasText(email)) {
                predicates.add(builder.like(builder.lower(root.get("email")), "%" + email.toLowerCase() + "%"));
            }

            if (hasText(address)) {
                predicates.add(builder.like(builder.lower(root.get("address")), "%" + address.toLowerCase() + "%"));
            }

            if (hasText(role)) {
                predicates.add(builder.equal(root.get("role"), Role.valueOf(role.toUpperCase())));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        }, sort);

        return users.stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());

    }

    public UserResponse getUser(Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return toUserResponse(user);

    }

    public List<StoreResponse> getStores(
            String name,
            String email,
            String address,
            String sortBy,
            String direction) {

        Sort sort = buildSort(sortBy, direction, List.of("name", "email", "address"));

        List<Store> stores = storeRepository.findAll((root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (hasText(name)) {
                predicates.add(builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (hasText(email)) {
                predicates.add(builder.like(builder.lower(root.get("email")), "%" + email.toLowerCase() + "%"));
            }

            if (hasText(address)) {
                predicates.add(builder.like(builder.lower(root.get("address")), "%" + address.toLowerCase() + "%"));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        }, sort);

        return stores.stream()
                .map(this::toStoreResponse)
                .collect(Collectors.toList());

    }

    private UserResponse toUserResponse(User user) {

        Double ownerRating = null;

        if (user.getRole() == Role.OWNER) {
            ownerRating = storeRepository.findByOwner(user)
                    .map(ratingRepository::averageRatingForStore)
                    .orElse(null);
        }

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAddress(),
                user.getRole().name(),
                ownerRating);

    }

    private StoreResponse toStoreResponse(Store store) {

        return new StoreResponse(
                store.getId(),
                store.getName(),
                store.getEmail(),
                store.getAddress(),
                ratingRepository.averageRatingForStore(store),
                null,
                store.getOwner() == null ? null : store.getOwner().getName());

    }

    private Sort buildSort(String sortBy, String direction, List<String> allowedFields) {

        String field = allowedFields.contains(sortBy) ? sortBy : "name";
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;

        return Sort.by(sortDirection, field);

    }

    private boolean hasText(String value) {

        return value != null && !value.isBlank();

    }

}
