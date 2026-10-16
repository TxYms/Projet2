import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {provideHttpClient} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        // remplace le vrai serveur : on intercepte les requêtes pour les vérifier
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to /api/login', () => {
    service.login({ login: 'jdoe', password: 'password' }).subscribe();

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ login: 'jdoe', password: 'password' });
    req.flush({ token: 'jwt-token' });
    httpMock.verify();
  });
});
