package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.exception.StudentNotFoundException;
import com.openclassrooms.etudiant.mapper.StudentDtoMapper;
import com.openclassrooms.etudiant.repository.StudentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final StudentDtoMapper studentDtoMapper;

    public StudentResponseDTO create(StudentRequestDTO studentRequestDTO) {
        Assert.notNull(studentRequestDTO, "Student must not be null");
        log.info("Creating new student");

        if (studentRepository.existsByEmail(studentRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Student with email " + studentRequestDTO.getEmail() + " already exists");
        }
        Student savedStudent = studentRepository.save(studentDtoMapper.toEntity(studentRequestDTO));
        return studentDtoMapper.toDto(savedStudent);
    }

    public List<StudentResponseDTO> findAll() {
        log.info("Fetching all students");
        return studentDtoMapper.toDtoList(studentRepository.findAll());
    }

    public StudentResponseDTO findById(Long id) {
        log.info("Fetching student {}", id);
        return studentDtoMapper.toDto(getStudentOrThrow(id));
    }

    public StudentResponseDTO update(Long id, StudentRequestDTO studentRequestDTO) {
        Assert.notNull(studentRequestDTO, "Student must not be null");
        log.info("Updating student {}", id);

        Student student = getStudentOrThrow(id);
        if (studentRepository.existsByEmailAndIdNot(studentRequestDTO.getEmail(), id)) {
            throw new IllegalArgumentException("Student with email " + studentRequestDTO.getEmail() + " already exists");
        }
        studentDtoMapper.updateEntity(studentRequestDTO, student);
        return studentDtoMapper.toDto(studentRepository.save(student));
    }

    public void delete(Long id) {
        log.info("Deleting student {}", id);
        studentRepository.delete(getStudentOrThrow(id));
    }

    private Student getStudentOrThrow(Long id) {
        Assert.notNull(id, "Id must not be null");
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }
}
