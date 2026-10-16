import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../service/auth.service';

// Tests unitaires du guard qui protège les écrans des étudiants
describe('authGuard', () => {
  // AuthService est remplacé par un mock : on choisit si l'utilisateur est connecté ou non
  const authServiceMock = { isLoggedIn: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ]
    });
  });

  // Un guard fonctionnel doit être appelé dans un contexte d'injection Angular
  const runGuard = () => TestBed.runInInjectionContext(
    () => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  it('should allow access when the user is logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);
    expect(runGuard()).toBe(true);
  });

  it('should redirect to /login when the user is not logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(false);

    const result = runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
  });
});
