import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';
import { StudentRequest } from '../../../core/models/StudentRequest';
import { getErrorMessage } from '../../../core/utils/error-message';

/**
 * Same screen for creation (/students/new) and modification (/students/:id/edit).
 */
@Component({
  selector: 'app-student-form',
  imports: [CommonModule, MaterialModule],
  templateUrl: './student-form.component.html',
  standalone: true,
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  studentForm: FormGroup = new FormGroup({});
  studentId: number | null = null;
  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  get isEditMode(): boolean {
    return this.studentId !== null;
  }

  ngOnInit() {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentId = Number(id);
      this.loadStudent(this.studentId);
    }
  }

  get form() {
    return this.studentForm.controls;
  }

  private loadStudent(id: number): void {
    this.loading = true;
    this.studentService.getById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (student: Student) => {
          this.studentForm.patchValue({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email
          });
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = getErrorMessage(error);
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    if (this.studentForm.invalid) {
      return;
    }
    const student: StudentRequest = {
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value,
      email: this.studentForm.get('email')?.value
    };
    const request$: Observable<Student> = this.studentId !== null
      ? this.studentService.update(this.studentId, student)
      : this.studentService.create(student);

    this.loading = true;
    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (savedStudent: Student) => {
          this.router.navigate(['/students', savedStudent.id]);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = getErrorMessage(error);
        }
      });
  }

  onCancel(): void {
    this.router.navigate(this.studentId !== null ? ['/students', this.studentId] : ['/students']);
  }
}
