package com.rating.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.rating.backend.entity.Store;
import com.rating.backend.entity.User;

import java.util.Optional;


public interface StoreRepository extends JpaRepository<Store, Long>, JpaSpecificationExecutor<Store>{

    Optional<Store> findByOwner(User owner);

}
