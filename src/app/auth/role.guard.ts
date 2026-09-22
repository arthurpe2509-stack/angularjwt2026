import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { AuthService } from './login/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requiredRoles = (route.data['roles'] as string[] | undefined) ?? [];
    const hasAccess = requiredRoles.some((role) => authService.hasRole(role));

    return hasAccess ? true : router.parseUrl('/');
};