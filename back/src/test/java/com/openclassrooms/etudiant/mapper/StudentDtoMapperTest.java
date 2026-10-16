package com.openclassrooms.etudiant.mapper;

import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests unitaires du mapper MapStruct (conversion entité <-> DTO).
 */
public class StudentDtoMapperTest {
    private final StudentDtoMapper mapper = new StudentDtoMapperImpl();

    private StudentRequestDTO buildRequest() {
        StudentRequestDTO dto = new StudentRequestDTO();
        dto.setFirstName("Alice");
        dto.setLastName("Martin");
        dto.setEmail("alice@mail.com");
        return dto;
    }

    @Test
    public void test_to_entity_copies_fields_without_id() {
        // WHEN : on convertit le DTO reçu en entité
        Student student = mapper.toEntity(buildRequest());

        // THEN : les champs sont copiés et l'id reste vide (c'est la base qui le génère)
        assertThat(student.getId()).isNull();
        assertThat(student.getFirstName()).isEqualTo("Alice");
        assertThat(student.getLastName()).isEqualTo("Martin");
        assertThat(student.getEmail()).isEqualTo("alice@mail.com");
    }

    @Test
    public void test_to_dto_copies_fields() {
        // GIVEN
        Student student = new Student(1L, "Alice", "Martin", "alice@mail.com", LocalDateTime.now(), null);

        // WHEN
        StudentResponseDTO dto = mapper.toDto(student);

        // THEN : l'id et les champs sont renvoyés
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getFirstName()).isEqualTo("Alice");
        assertThat(dto.getLastName()).isEqualTo("Martin");
        assertThat(dto.getEmail()).isEqualTo("alice@mail.com");
    }
}
