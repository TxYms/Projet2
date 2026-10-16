import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Stores the JWT received at login and tells whether the user is logged in.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly TOKEN_KEY = 'token';
  private router = inject(Router);

  saveToken(token: string): void {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      // The JWT payload (2nd part) contains "exp", the expiration date in seconds
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
