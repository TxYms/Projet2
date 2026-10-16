import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth.service';

// Test de l'intercepteur qui ajoute le token aux appels de l'API
describe('authInterceptor', () => {
  const authServiceMock = { getToken: jest.fn(), logout: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
      ]
    });
  });

  it('should add the Bearer token on a call to the API', () => {
    // GIVEN : l'utilisateur a un token
    authServiceMock.getToken.mockReturnValue('jwt-token');
    const httpMock = TestBed.inject(HttpTestingController);

    // WHEN : un appel part vers une route protégée
    TestBed.inject(HttpClient).get('/api/students').subscribe();

    // THEN : le header Authorization a été ajouté
    const req = httpMock.expectOne('/api/students');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    req.flush([]);
    httpMock.verify();
  });
});
