import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { AuthService } from '../../../core/service/auth.service';
import { Student } from '../../../core/models/Student';
import { getErrorMessage } from '../../../core/utils/error-message';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-list.component.html',
  standalone: true,
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  students: Student[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = null;
    this.studentService.getAll()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (students: Student[]) => {
          this.students = students;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = getErrorMessage(error);
        }
      });
  }

  onDelete(student: Student): void {
    if (!confirm(`Delete ${student.firstName} ${student.lastName}?`)) {
      return;
    }
    this.errorMessage = null;
    this.studentService.delete(student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.students = this.students.filter(s => s.id !== student.id);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = getErrorMessage(error);
        }
      });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
