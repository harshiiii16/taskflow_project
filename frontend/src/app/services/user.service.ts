// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]>              { return this.http.get<User[]>(this.url); }
  getById(id: number): Observable<User>     { return this.http.get<User>(`${this.url}/${id}`); }
  updateRole(id: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}/role`, { role });
  }
  delete(id: number): Observable<void>      { return this.http.delete<void>(`${this.url}/${id}`); }
}
