package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.mapper.StudentDtoMapperImpl;
import com.openclassrooms.etudiant.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Tests unitaires de StudentService.
 * Le repository est un mock : on teste uniquement la logique du service, sans base de données.
 * Le mapper est le vrai (généré par MapStruct) car il n'a aucune dépendance.
 */
@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {
    private static final Long ID = 1L;
    private static final String FIRST_NAME = "Alice";
    private static final String LAST_NAME = "Martin";
    private static final String EMAIL = "alice@mail.com";

    @Mock
    private StudentRepository studentRepository;

    private StudentService studentService;

    @BeforeEach
    public void setUp() {
        studentService = new StudentService(studentRepository, new StudentDtoMapperImpl());
    }

    private StudentRequestDTO buildRequest(String lastName) {
        StudentRequestDTO dto = new StudentRequestDTO();
        dto.setFirstName(FIRST_NAME);
        dto.setLastName(lastName);
        dto.setEmail(EMAIL);
        return dto;
    }

    private Student buildStudent(Long id) {
        return new Student(id, FIRST_NAME, LAST_NAME, EMAIL, null, null);
    }

    // ---------- create ----------

    @Test
    public void test_create_student_returns_saved_student() {
        // GIVEN : l'email n'est pas encore utilisé et la base renvoie l'étudiant avec un id
        when(studentRepository.existsByEmail(EMAIL)).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> {
            Student student = invocation.getArgument(0);
            student.setId(ID);
            return student;
        });

        // WHEN
        StudentResponseDTO result = studentService.create(buildRequest(LAST_NAME));

        // THEN : l'étudiant est renvoyé avec son id et ses informations
        assertThat(result.getId()).isEqualTo(ID);
        assertThat(result.getFirstName()).isEqualTo(FIRST_NAME);
        assertThat(result.getLastName()).isEqualTo(LAST_NAME);
        assertThat(result.getEmail()).isEqualTo(EMAIL);

        // et l'entité envoyée en base contient bien les données du DTO
        ArgumentCaptor<Student> captor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(captor.capture());
        assertThat(captor.getValue().getEmail()).isEqualTo(EMAIL);
    }

    @Test
    public void test_find_all_returns_all_students() {
        // GIVEN : 2 étudiants en base
        when(studentRepository.findAll()).thenReturn(List.of(buildStudent(1L), buildStudent(2L)));

        // WHEN
        List<StudentResponseDTO> result = studentService.findAll();

        // THEN : les 2 étudiants sont renvoyés sous forme de DTO
        assertThat(result).hasSize(2);
        assertThat(result).extracting(StudentResponseDTO::getId).containsExactly(1L, 2L);
    }

    @Test
    public void test_find_by_id_returns_student() {
        // GIVEN : l'étudiant 1 existe
        when(studentRepository.findById(ID)).thenReturn(Optional.of(buildStudent(ID)));

        // WHEN
        StudentResponseDTO result = studentService.findById(ID);

        // THEN
        assertThat(result.getId()).isEqualTo(ID);
        assertThat(result.getEmail()).isEqualTo(EMAIL);
    }

    @Test
    public void test_update_student_returns_updated_student() {
        // GIVEN : l'étudiant 1 existe et l'email n'est pas pris par un autre étudiant
        when(studentRepository.findById(ID)).thenReturn(Optional.of(buildStudent(ID)));
        when(studentRepository.existsByEmailAndIdNot(EMAIL, ID)).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN : on change le nom de famille
        StudentResponseDTO result = studentService.update(ID, buildRequest("Durand"));

        // THEN : le nom est modifié et l'id ne change pas
        assertThat(result.getId()).isEqualTo(ID);
        assertThat(result.getLastName()).isEqualTo("Durand");
    }

    @Test
    public void test_delete_student_deletes_it() {
        // GIVEN : l'étudiant 1 existe
        Student student = buildStudent(ID);
        when(studentRepository.findById(ID)).thenReturn(Optional.of(student));

        // WHEN
        studentService.delete(ID);

        // THEN : la suppression est demandée au repository pour cet étudiant
        verify(studentRepository).delete(student);
    }
}
