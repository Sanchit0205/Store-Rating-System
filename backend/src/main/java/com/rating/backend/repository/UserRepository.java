package com.rating.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.rating.backend.entity.User;


public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User>{


    Optional<User> findByEmail(String email);


}
