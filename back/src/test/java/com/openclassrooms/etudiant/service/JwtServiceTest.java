package com.openclassrooms.etudiant.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests unitaires de JwtService.
 * Le service n'a pas de dépendance : on l'instancie directement avec une clé de test.
 */
public class JwtServiceTest {
    // Clé de test encodée en Base64 (32 octets = 256 bits, minimum pour HS256)
    private static final String SECRET = "dGVzdC1zZWNyZXQta2V5LWZvci1qd3QtdW5pdC10ZXN0cw==";
    private static final long ONE_HOUR = 3600000L;

    private JwtService jwtService;
    private UserDetails jdoe;

    @BeforeEach
    public void setUp() {
        jwtService = new JwtService(SECRET, ONE_HOUR);
        jdoe = User.withUsername("jdoe").password("password").build();
    }

    @Test
    public void test_generate_token_contains_username() {
        // WHEN : on génère un token pour jdoe
        String token = jwtService.generateToken(jdoe);

        // THEN : le token n'est pas vide et on retrouve le login dedans
        assertThat(token).isNotBlank();
        assertThat(jwtService.extractUsername(token)).isEqualTo("jdoe");
    }

    @Test
    public void test_token_is_valid_for_its_owner() {
        // GIVEN
        String token = jwtService.generateToken(jdoe);

        // WHEN / THEN : le token est valide pour l'utilisateur à qui il a été délivré
        assertThat(jwtService.isTokenValid(token, jdoe)).isTrue();
    }
}
