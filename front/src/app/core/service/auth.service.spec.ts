import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from './auth.service';

// Construit un faux JWT (seul le payload compte pour le front) avec une date d'expiration
function buildToken(expSeconds: number): string {
  const payload = btoa(JSON.stringify({ sub: 'jdoe', exp: expSeconds }));
  return `header.${payload}.signature`;
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be logged in with a valid token', () => {
    // GIVEN : un token valide 1 h est enregistré
    service.saveToken(buildToken(Math.floor(Date.now() / 1000) + 3600));

    // THEN
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should remove the token on logout', () => {
    service.saveToken(buildToken(Math.floor(Date.now() / 1000) + 3600));

    service.logout();

    expect(service.getToken()).toBeNull();
  });
});
