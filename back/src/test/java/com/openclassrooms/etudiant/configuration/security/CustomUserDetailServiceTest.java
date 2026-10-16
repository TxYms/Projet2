package com.openclassrooms.etudiant.configuration.security;

import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Tests unitaires de CustomUserDetailService : chargement d'un utilisateur par son login.
 */
@ExtendWith(MockitoExtension.class)
public class CustomUserDetailServiceTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private CustomUserDetailService customUserDetailService;

    @Test
    public void test_load_existing_user_returns_user_details() {
        // GIVEN : l'utilisateur jdoe existe en base
        User user = new User();
        user.setLogin("jdoe");
        user.setPassword("hash");
        when(userRepository.findByLogin("jdoe")).thenReturn(Optional.of(user));

        // WHEN
        UserDetails result = customUserDetailService.loadUserByUsername("jdoe");

        // THEN : on récupère bien jdoe
        assertThat(result.getUsername()).isEqualTo("jdoe");
        assertThat(result.isEnabled()).isTrue();
    }
}
