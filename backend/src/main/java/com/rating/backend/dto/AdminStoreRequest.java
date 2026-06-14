package com.rating.backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class AdminStoreRequest {


    @NotBlank
    @Size(min = 20, max = 60)
    private String name;

    @NotBlank
    @Email
    private String email;

    @Size(max = 400)
    private String address;

    @NotNull
    private Long ownerId;


}
