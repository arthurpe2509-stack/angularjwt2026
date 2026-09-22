import { inject, Injectable } from "@angular/core";
import { AuthResponse } from "../../core/models/AutResponse";
import { Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";

export interface LoginCredentials {
    username: string;
    password: string;
}

const TOKEN_KEY = 'accessToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
            .pipe(tap((response) => this.setToken(response.token)));
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
}