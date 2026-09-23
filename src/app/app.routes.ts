import { Routes } from '@angular/router';
import { roleGuard } from './auth/role.guard';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./auth/login/login.component').then(({ LoginComponent }) => LoginComponent),
  },
  {
    path: 'todos',
    canActivate: [roleGuard, authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] },
    loadComponent: () =>
      import('./todos/todos/todos.component').then(({ TodosComponent }) => TodosComponent),
  },
  { path: '**', redirectTo: '' },
];
