import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: UserService, useClass: UserMockService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register the user and go to /login', () => {
    // GIVEN : l'inscription réussit côté serveur
    const registerSpy = jest.spyOn(TestBed.inject(UserService), 'register').mockReturnValue(of({}));
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    // alert() n'existe pas dans l'environnement de test : on la remplace
    jest.spyOn(window, 'alert').mockImplementation(() => undefined);

    // WHEN : le formulaire est rempli puis validé
    component.registerForm.setValue({ firstName: 'John', lastName: 'Doe', login: 'jdoe', password: 'password' });
    component.onSubmit();

    // THEN
    expect(registerSpy).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Doe', login: 'jdoe', password: 'password' });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
