import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { TodoItem } from '../../core/models/todo-item.model';
import { TodoService } from '../todos.service';

@Component({
  selector: 'app-todos',
  imports: [FormField, FormRoot],
  templateUrl: './todos.component.html',
})
export class TodosComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);

  protected readonly todoList = signal<TodoItem[]>([]);
  protected readonly todoModel = signal({ title: '' });

  protected readonly todoForm = form(
    this.todoModel,
    (path) => {
      required(path.title, { message: 'Title is required' });
    },
    {
      submission: {
        action: async (field) => {
          const todo = await firstValueFrom(this.todoService.createTodo(this.todoModel().title));
          this.todoList.update((todos) => [...todos, todo]);
          field().reset({ title: '' });
        },
      },
    },
  );

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((todos) => this.todoList.set(todos));
  }

  protected async logout(): Promise<void> {
    // TODO: clear the authentication state once JWT authentication is implemented.
    await this.router.navigate(['/']);
  }
}
