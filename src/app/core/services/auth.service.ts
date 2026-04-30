import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthUser, JwtResponse, LoginRequest, PasswordChangeRequestDto } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';
  
  private readonly STORAGE_KEYS = {
    TOKEN: 'aml.auth.jwt',
    REFRESH_TOKEN: 'aml.auth.refreshToken',
    PREFIX: 'aml.auth.prefix',
    EMAIL: 'aml.auth.email',
    BANK_NAME: 'aml.auth.bankName',
    ROLES: 'aml.auth.roles'
  };

  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  // For token refresh synchronization
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.rehydrate();
  }

  login(payload: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.apiBaseUrl}/auth/login`, payload)
      .pipe(tap((response) => this.persistSession(response)));
  }

  updatePassword(payload: PasswordChangeRequestDto): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/auth/update-password`, payload, { responseType: 'text' });
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  getTokenPrefix(): string {
    return localStorage.getItem(this.STORAGE_KEYS.PREFIX) ?? 'Bearer';
  }

  refreshToken(token: string): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.apiBaseUrl}/auth/refreshtoken`, { refreshToken: token })
      .pipe(tap((response) => this.persistSession(response)));
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
  }

  logout(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this.currentUserSubject.next(null);
  }

  rehydrate(): void {
    const session = this.restoreSession();
    if (session) {
      this.currentUserSubject.next(session);
    }
  }

  private persistSession(response: JwtResponse): void {
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, response.jwt || '');
    localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken || '');
    localStorage.setItem(this.STORAGE_KEYS.PREFIX, response.prefix || 'Bearer');
    localStorage.setItem(this.STORAGE_KEYS.EMAIL, response.email || '');
    localStorage.setItem(this.STORAGE_KEYS.BANK_NAME, response.bankName || '');
    
    const user = this.mapResponseToUser(response);
    localStorage.setItem(this.STORAGE_KEYS.ROLES, JSON.stringify(user.roles));
    
    this.currentUserSubject.next(user);
  }

  private restoreSession(): AuthUser | null {
    const jwt = localStorage.getItem(this.STORAGE_KEYS.TOKEN);
    const email = localStorage.getItem(this.STORAGE_KEYS.EMAIL);
    const bankName = localStorage.getItem(this.STORAGE_KEYS.BANK_NAME);
    const storedRoles = localStorage.getItem(this.STORAGE_KEYS.ROLES);

    if (!jwt || !email) {
      return null;
    }

    let roles: string[] = [];
    try {
      roles = storedRoles ? JSON.parse(storedRoles) : [];
    } catch {
      roles = [];
    }

    return this.mapResponseToUser({
      jwt,
      prefix: localStorage.getItem(this.STORAGE_KEYS.PREFIX) ?? 'Bearer',
      refreshToken: localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN) ?? '',
      email,
      bankName: bankName ?? 'Unknown Bank',
      roles: roles
    });
  }

  private mapResponseToUser(response: JwtResponse): AuthUser {
    // 1. If explicit roles are provided, use them
    // 2. If not, try to extract from JWT
    // 3. Fallback to empty
    let roles = response.roles && response.roles.length > 0 
      ? response.roles 
      : this.extractRolesFromJwt(response.jwt, []);

    return {
      email: response.email || 'user@example.com',
      bankName: response.bankName || 'Unknown Bank',
      roles,
      primaryRole: roles[0] ?? 'USER',
      initials: this.buildInitials(response.email || 'U')
    };
  }

  private extractRolesFromJwt(jwt: string, fallbackRoles: string[]): string[] {
    if (!jwt) return fallbackRoles;
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) return fallbackRoles;
      
      const payload = parts[1];
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(normalizedPayload));

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
    if (!email || !email.includes('@')) return 'U';
    const [localPart] = email.split('@');
    return localPart.slice(0, 2).toUpperCase();
  }
}
