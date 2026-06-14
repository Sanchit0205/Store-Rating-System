package com.rating.backend.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rating.backend.entity.Rating;
import com.rating.backend.entity.Store;
import com.rating.backend.entity.User;


public interface RatingRepository extends JpaRepository<Rating, Long>{

    Optional<Rating> findByUserAndStore(User user, Store store);

    List<Rating> findByStore(Store store);

    @Query("select avg(r.rating) from Rating r where r.store = :store")
    Double averageRatingForStore(Store store);

}
