import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { TodoItem } from '../core/models/todo-item.model';

@Service()
export class TodoService {
  private readonly http = inject(HttpClient);

  getTodos(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(`${environment.apiUrl}/todos`);
  }

  createTodo(title: string): Observable<TodoItem> {
    return this.http.post<TodoItem>(`${environment.apiUrl}/todos`, { title });
  }
}
