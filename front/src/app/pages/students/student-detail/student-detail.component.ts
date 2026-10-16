import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';
import { getErrorMessage } from '../../../core/utils/error-message';

@Component({
  selector: 'app-student-detail',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-detail.component.html',
  standalone: true,
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  student: Student | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.studentService.getById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (student: Student) => {
          this.student = student;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = getErrorMessage(error);
        }
      });
  }

  onDelete(): void {
    if (!this.student || !confirm(`Delete ${this.student.firstName} ${this.student.lastName}?`)) {
      return;
    }
    this.errorMessage = null;
    this.studentService.delete(this.student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = getErrorMessage(error);
        }
      });
  }
}
