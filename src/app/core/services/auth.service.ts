import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthUser, JwtResponse, LoginRequest } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';
  private readonly tokenStorageKey = 'aml.auth.jwt';
  private readonly refreshTokenStorageKey = 'aml.auth.refreshToken';
  private readonly tokenPrefixStorageKey = 'aml.auth.prefix';
  private readonly emailStorageKey = 'aml.auth.email';
  private readonly bankNameStorageKey = 'aml.auth.bankName';
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.restoreSession());

  readonly currentUser$ = this.currentUserSubject.asObservable();

  login(payload: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.apiBaseUrl}/auth/login`, payload)
      .pipe(tap((response) => this.persistSession(response)));
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.refreshTokenStorageKey);
    localStorage.removeItem(this.tokenPrefixStorageKey);
    localStorage.removeItem(this.emailStorageKey);
    localStorage.removeItem(this.bankNameStorageKey);
    this.currentUserSubject.next(null);
  }

  private persistSession(response: JwtResponse): void {
    localStorage.setItem(this.tokenStorageKey, response.jwt);
    localStorage.setItem(this.refreshTokenStorageKey, response.refreshToken);
    localStorage.setItem(this.tokenPrefixStorageKey, response.prefix);
    localStorage.setItem(this.emailStorageKey, response.email);
    localStorage.setItem(this.bankNameStorageKey, response.bankName);
    this.currentUserSubject.next(this.mapResponseToUser(response));
  }

  private restoreSession(): AuthUser | null {
    const jwt = localStorage.getItem(this.tokenStorageKey);
    const email = localStorage.getItem(this.emailStorageKey);
    const bankName = localStorage.getItem(this.bankNameStorageKey);

    if (!jwt || !email || !bankName) {
      return null;
    }

    return this.mapResponseToUser({
      jwt,
      prefix: localStorage.getItem(this.tokenPrefixStorageKey) ?? 'Bearer',
      refreshToken: localStorage.getItem(this.refreshTokenStorageKey) ?? '',
      email,
      bankName,
      roles: []
    });
  }

  private mapResponseToUser(response: JwtResponse): AuthUser {
    const roles = this.extractRolesFromJwt(response.jwt, response.roles);

    return {
      email: response.email,
      bankName: response.bankName,
      roles,
      primaryRole: roles[0] ?? 'USER',
      initials: this.buildInitials(response.email)
    };
  }

  private extractRolesFromJwt(jwt: string, fallbackRoles: string[]): string[] {
    try {
      const payload = jwt.split('.')[1];

      if (!payload) {
        return fallbackRoles;
      }

      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(normalizedPayload)) as {
        roles?: string[];
        authorities?: string[];
        role?: string | string[];
      };

      const rolesClaim = decodedPayload.roles ?? decodedPayload.authorities ?? decodedPayload.role;

      if (Array.isArray(rolesClaim)) {
        return rolesClaim;
      }

      if (typeof rolesClaim === 'string' && rolesClaim.trim()) {
        return [rolesClaim];
      }
    } catch {
      return fallbackRoles;
    }

    return fallbackRoles;
  }

  private buildInitials(email: string): string {
    const [localPart] = email.split('@');
    return localPart.slice(0, 2).toUpperCase();
  }
}
