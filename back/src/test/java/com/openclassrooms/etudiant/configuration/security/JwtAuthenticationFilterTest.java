package com.openclassrooms.etudiant.configuration.security;

import com.openclassrooms.etudiant.service.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Tests unitaires du filtre JWT.
 * JwtService et CustomUserDetailService sont des mocks : on vérifie seulement si le filtre
 * déclare (ou non) l'utilisateur authentifié dans le SecurityContext.
 */
@ExtendWith(MockitoExtension.class)
public class JwtAuthenticationFilterTest {
    private static final String TOKEN = "header.payload.signature";

    @Mock
    private JwtService jwtService;
    @Mock
    private CustomUserDetailService customUserDetailService;

    private JwtAuthenticationFilter filter;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private MockFilterChain filterChain;
    private UserDetails jdoe;

    @BeforeEach
    public void setUp() {
        filter = new JwtAuthenticationFilter(jwtService, customUserDetailService);
        request = new MockHttpServletRequest("GET", "/api/students");
        response = new MockHttpServletResponse();
        filterChain = new MockFilterChain();
        jdoe = User.withUsername("jdoe").password("hash").build();
    }

    @AfterEach
    public void tearDown() {
        // On vide le contexte de sécurité pour que les tests restent indépendants
        SecurityContextHolder.clearContext();
    }

    private Authentication currentAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    @Test
    public void test_request_with_valid_token_is_authenticated() throws Exception {
        // GIVEN : un token valide appartenant à jdoe
        request.addHeader("Authorization", "Bearer " + TOKEN);
        when(jwtService.extractUsername(TOKEN)).thenReturn("jdoe");
        when(customUserDetailService.loadUserByUsername("jdoe")).thenReturn(jdoe);
        when(jwtService.isTokenValid(TOKEN, jdoe)).thenReturn(true);

        // WHEN
        filter.doFilter(request, response, filterChain);

        // THEN : jdoe est authentifié et la requête continue
        assertThat(currentAuthentication()).isNotNull();
        assertThat(currentAuthentication().getName()).isEqualTo("jdoe");
        assertThat(filterChain.getRequest()).isNotNull();
    }
}
