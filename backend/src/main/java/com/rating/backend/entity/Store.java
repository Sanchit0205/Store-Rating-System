package com.rating.backend.entity;


import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "stores")
public class Store {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private String email;


    @Column(length = 400)
    private String address;


    @OneToOne
    @JoinColumn(name = "owner_id")
    private User owner;

}