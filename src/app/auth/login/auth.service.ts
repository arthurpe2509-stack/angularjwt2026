import { inject, Injectable } from "@angular/core";
import { AuthResponse } from "../../core/models/AutResponse";
import { Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface JwtPayLoad {
    roles?: string[];
    scope?: string;
    [key: string]: unknown;
}

const TOKEN_KEY = 'accessToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
            .pipe(tap((response) => {
                this.setToken(response.token);
                this.decodeToken(this.getToken()!);
                console.log('roles:', this.getRoles());

            }));

    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
    }

    private setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    private decodeToken(token: string): JwtPayLoad | null {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        try {
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
            return JSON.parse(atob(padded)) as JwtPayLoad;
        } catch (error) {
            return null;
        }
    }

    getPayload(): JwtPayLoad | null {
        const token = this.getToken();
        console.log(this.decodeToken(this.getToken()!));
        return token ? this.decodeToken(token) : null;
    }

    getRoles(): string[] {
        const scope = this.getPayload()?.scope;
        if (!scope) {
            return [];
        }
        return scope.split(' ').filter((s) => s.startsWith('ROLE_'));
    }

    hasRole(role: string): boolean {
        return this.getRoles().includes(role);
    }
}