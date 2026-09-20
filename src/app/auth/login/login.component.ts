import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly router = inject(Router);

  protected readonly loginModel = signal({
    username: 'bastien@example.com',
    password: 'tacostacos',
  });

  protected readonly loginForm = form(
    this.loginModel,
    (path) => {
      required(path.username, { message: 'Email is required' });
      email(path.username, { message: 'Please enter a valid email address' });
      required(path.password, { message: 'Password is required' });
    },
    {
      submission: {
        action: async () => {
          // TODO login
          await this.router.navigate(['/todos']);
        },
      },
    },
  );
}
