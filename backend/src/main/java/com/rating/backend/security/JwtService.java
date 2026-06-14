package com.rating.backend.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

        private final String SECRET_KEY = "mysecretkeymysecretkeymysecretkey12345";

        private SecretKey getSigningKey() {

                return Keys.hmacShaKeyFor(
                                SECRET_KEY.getBytes(StandardCharsets.UTF_8));

        }

        public String generateToken(String email, String role) {

                return Jwts.builder()

                                .setSubject(email)

                                .claim("role", role)

                                .setIssuedAt(new Date())

                                .setExpiration(
                                                new Date(
                                                                System.currentTimeMillis()
                                                                                + 1000 * 60 * 60 * 24))

                                .signWith(
                                                getSigningKey(),
                                                SignatureAlgorithm.HS256)

                                .compact();

        }

        public String extractEmail(String token) {

                return Jwts.parserBuilder()

                                .setSigningKey(getSigningKey())

                                .build()

                                .parseClaimsJws(token)

                                .getBody()

                                .getSubject();

        }

        public String extractRole(String token){


    return Jwts.parserBuilder()

            .setSigningKey(getSigningKey())

            .build()

            .parseClaimsJws(token)

            .getBody()

            .get("role", String.class);

}

}