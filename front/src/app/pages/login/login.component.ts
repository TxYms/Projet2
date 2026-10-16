import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Login } from '../../core/models/Login';
import { LoginResponse } from '../../core/models/LoginResponse';
import { AuthService } from '../../core/service/auth.service';
import { getErrorMessage } from '../../core/utils/error-message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      return;
    }
    const credentials: Login = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };
    this.loading = true;
    this.userService.login(credentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response: LoginResponse) => {
          this.authService.saveToken(response.token);
          this.router.navigate(['/students']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = getErrorMessage(error);
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.errorMessage = null;
    this.loginForm.reset();
  }
}
