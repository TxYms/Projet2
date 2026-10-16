import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StudentService } from './student.service';
import { Student } from '../models/Student';

// Tests unitaires du service qui appelle l'API des étudiants :
// pour chaque méthode, on vérifie la méthode HTTP, l'URL et le corps envoyés
describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;
  const alice: Student = { id: 1, firstName: 'Alice', lastName: 'Martin', email: 'alice@mail.com' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should get all students', () => {
    let result: Student[] = [];
    service.getAll().subscribe(students => result = students);

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('GET');
    req.flush([alice]);
    expect(result).toEqual([alice]);
  });

  it('should get one student by id', () => {
    let result: Student | undefined;
    service.getById(1).subscribe(student => result = student);

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('GET');
    req.flush(alice);
    expect(result).toEqual(alice);
  });

  it('should create a student', () => {
    const body = { firstName: 'Alice', lastName: 'Martin', email: 'alice@mail.com' };
    service.create(body).subscribe();

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 1, ...body });
  });

  it('should update a student', () => {
    const body = { firstName: 'Alice', lastName: 'Durand', email: 'alice@mail.com' };
    service.update(1, body).subscribe();

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 1, ...body });
  });

  it('should delete a student', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
