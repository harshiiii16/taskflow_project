// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskRequest } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private url = `${environment.apiUrl}/tasks`;
  constructor(private http: HttpClient) {}

  getAll(projectId?: number): Observable<Task[]> {
    const params = projectId ? new HttpParams().set('projectId', projectId) : {};
    return this.http.get<Task[]>(this.url, { params });
  }

  getById(id: number): Observable<Task>         { return this.http.get<Task>(`${this.url}/${id}`); }
  create(t: TaskRequest): Observable<Task>       { return this.http.post<Task>(this.url, t); }
  update(id: number, t: Partial<TaskRequest>): Observable<Task> { return this.http.put<Task>(`${this.url}/${id}`, t); }
  delete(id: number): Observable<void>           { return this.http.delete<void>(`${this.url}/${id}`); }

  toggleDone(task: Task): Observable<Task> {
    const status = task.status === 'DONE' ? 'TODO' : 'DONE';
    return this.update(task.id, { status });
  }
}
