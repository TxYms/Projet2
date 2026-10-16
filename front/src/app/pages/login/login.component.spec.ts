import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';

// Test d'intégration du composant avec son template ; les services sont des mocks
describe('LoginComponent', () => {
  it('should save the token and go to /students when the login succeeds', async () => {
    const userServiceMock = { login: jest.fn().mockReturnValue(of({ token: 'jwt-token' })) };
    const authServiceMock = { saveToken: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ]
    }).compileComponents();
    const fixture: ComponentFixture<LoginComponent> = TestBed.createComponent(LoginComponent);
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();

    // WHEN : l'utilisateur remplit le formulaire et valide
    fixture.componentInstance.loginForm.setValue({ login: 'jdoe', password: 'password' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    // THEN : le token est enregistré et on part sur la liste des étudiants
    expect(userServiceMock.login).toHaveBeenCalledWith({ login: 'jdoe', password: 'password' });
    expect(authServiceMock.saveToken).toHaveBeenCalledWith('jwt-token');
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});
