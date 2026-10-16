import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentListComponent } from './pages/students/student-list/student-list.component';
import { StudentDetailComponent } from './pages/students/student-detail/student-detail.component';
import { StudentFormComponent } from './pages/students/student-form/student-form.component';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // Student screens: protected by the guard (user must be logged in)
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/new',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id',
    component: StudentDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id/edit',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'students'
  }
];
