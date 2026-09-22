import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './login/auth.service';

function getErrorMessage(error: HttpErrorResponse, isLoginRequest: boolean): string {
    if (error.status === 401 && isLoginRequest) {
        return 'Email ou mot de passe incorrect.';
    }
    if (error.status === 401) {
        return 'Votre session a expiré, veuillez vous reconnecter.';
    }
    if (error.status === 403) {
        return "Vous n'avez pas les droits nécessaires pour réaliser cette action.";
    }
    return 'Une erreur inattendue est survenue. Veuillez réessayer.';
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const isLoginRequest = req.url.endsWith('/auth/login');
    const token = isLoginRequest ? null : inject(AuthService).getToken();

    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            alert(getErrorMessage(error, isLoginRequest));
            return throwError(() => error);
        }),
    );
};
