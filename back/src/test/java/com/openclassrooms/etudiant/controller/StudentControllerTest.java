package com.openclassrooms.etudiant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.StudentRepository;
import com.openclassrooms.etudiant.repository.UserRepository;
import com.openclassrooms.etudiant.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests d'intégration de StudentController, sur le modèle de UserControllerTest :
 * toute l'application démarre avec une vraie base MySQL dans un conteneur Docker (Testcontainers),
 * et les requêtes HTTP sont simulées avec MockMvc.
 * Avant chaque test, un agent est créé et connecté pour obtenir un token JWT.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public class StudentControllerTest {

    private static final String URL = "/api/students";
    private static final String LOGIN = "agent";
    private static final String PASSWORD = "password";

    @Container
    static MySQLContainer mySQLContainer = new MySQLContainer("mysql:8.4");

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MockMvc mockMvc;

    private String token;

    @DynamicPropertySource
    static void configureTestProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> mySQLContainer.getJdbcUrl());
        registry.add("spring.datasource.username", () -> mySQLContainer.getUsername());
        registry.add("spring.datasource.password", () -> mySQLContainer.getPassword());
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
    }

    @BeforeEach
    public void beforeEach() {
        // Un agent est inscrit puis connecté : son token sera envoyé dans le header Authorization
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setLogin(LOGIN);
        user.setPassword(PASSWORD);
        userService.register(user);
        token = userService.login(LOGIN, PASSWORD);
    }

    @AfterEach
    public void afterEach() {
        // On vide les tables pour que chaque test parte d'une base propre
        studentRepository.deleteAll();
        userRepository.deleteAll();
    }

    private String bearer() {
        return "Bearer " + token;
    }

    private StudentRequestDTO buildRequest(String lastName, String email) {
        StudentRequestDTO dto = new StudentRequestDTO();
        dto.setFirstName("Alice");
        dto.setLastName(lastName);
        dto.setEmail(email);
        return dto;
    }

    private Student saveStudent(String email) {
        return studentRepository.save(new Student(null, "Alice", "Martin", email, null, null));
    }

    // ---------- POST /api/students ----------

    @Test
    public void createStudentSuccessful() throws Exception {
        // WHEN : on crée un étudiant avec des données valides
        mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .content(objectMapper.writeValueAsString(buildRequest("Martin", "alice@mail.com")))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                // THEN : 201 et l'étudiant est renvoyé avec l'id généré par la base
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.lastName").value("Martin"))
                .andExpect(jsonPath("$.email").value("alice@mail.com"));

        // et il est bien enregistré en base
        assertThat(studentRepository.count()).isEqualTo(1);
    }

    @Test
    public void getAllStudents() throws Exception {
        // GIVEN : 2 étudiants en base
        saveStudent("alice@mail.com");
        saveStudent("bob@mail.com");

        // WHEN / THEN : la liste contient les 2 étudiants
        mockMvc.perform(MockMvcRequestBuilders.get(URL)
                        .header(HttpHeaders.AUTHORIZATION, bearer()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // ---------- GET /api/students/{id} ----------

    @Test
    public void getStudentById() throws Exception {
        // GIVEN
        Student student = saveStudent("alice@mail.com");

        // WHEN / THEN : on récupère bien cet étudiant
        mockMvc.perform(MockMvcRequestBuilders.get(URL + "/" + student.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(student.getId()))
                .andExpect(jsonPath("$.email").value("alice@mail.com"));
    }

    @Test
    public void updateStudentSuccessful() throws Exception {
        // GIVEN
        Student student = saveStudent("alice@mail.com");

        // WHEN : on change le nom de famille
        mockMvc.perform(MockMvcRequestBuilders.put(URL + "/" + student.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .content(objectMapper.writeValueAsString(buildRequest("Durand", "alice@mail.com")))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                // THEN : la réponse contient le nouveau nom, et la base aussi
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Durand"));
        assertThat(studentRepository.findById(student.getId()).orElseThrow().getLastName()).isEqualTo("Durand");
    }

    @Test
    public void deleteStudentSuccessful() throws Exception {
        // GIVEN
        Student student = saveStudent("alice@mail.com");

        // WHEN : on supprime l'étudiant
        mockMvc.perform(MockMvcRequestBuilders.delete(URL + "/" + student.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer()))
                .andDo(print())
                // THEN : 204 et il n'existe plus en base
                .andExpect(status().isNoContent());
        assertThat(studentRepository.existsById(student.getId())).isFalse();
    }

    @Test
    public void getAllStudentsWithoutToken() throws Exception {
        // WHEN / THEN : sans token, la route est refusée
        mockMvc.perform(MockMvcRequestBuilders.get(URL))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }
}
