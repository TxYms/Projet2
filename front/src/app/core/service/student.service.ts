import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/Student';
import { StudentRequest } from '../models/StudentRequest';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private static readonly API_URL = '/api/students';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(StudentService.API_URL);
  }

  getById(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`${StudentService.API_URL}/${id}`);
  }

  create(student: StudentRequest): Observable<Student> {
    return this.httpClient.post<Student>(StudentService.API_URL, student);
  }

  update(id: number, student: StudentRequest): Observable<Student> {
    return this.httpClient.put<Student>(`${StudentService.API_URL}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${StudentService.API_URL}/${id}`);
  }
}
