import { Observable, of } from 'rxjs';
import { Student } from '../models/Student';
import { StudentRequest } from '../models/StudentRequest';

export class StudentMockService {
  private students: Student[] = [
    { id: 1, firstName: 'Alice', lastName: 'Martin', email: 'alice@mail.com' }
  ];

  getAll(): Observable<Student[]> {
    return of(this.students);
  }

  getById(id: number): Observable<Student> {
    return of(this.students[0]);
  }

  create(student: StudentRequest): Observable<Student> {
    return of({ id: 2, ...student });
  }

  update(id: number, student: StudentRequest): Observable<Student> {
    return of({ id, ...student });
  }

  delete(id: number): Observable<void> {
    return of(undefined);
  }
}
