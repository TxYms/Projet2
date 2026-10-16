import {Register} from '../models/Register';
import {Observable, of} from 'rxjs';
import { Login } from '../models/Login';
import { LoginResponse } from '../models/LoginResponse';

export class UserMockService {

  register(user: Register): Observable<Object> {
    return of();
  }
  login(credentials: Login): Observable<LoginResponse> {
    return of({ token: 'fake-token' });
  }
}
