// src/app/services/project.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private url = `${environment.apiUrl}/projects`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Project[]>           { return this.http.get<Project[]>(this.url); }
  getById(id: number): Observable<Project>  { return this.http.get<Project>(`${this.url}/${id}`); }
  create(p: {name:string;description:string}): Observable<Project> { return this.http.post<Project>(this.url, p); }
  update(id: number, p: Partial<Project>): Observable<Project> { return this.http.put<Project>(`${this.url}/${id}`, p); }
  delete(id: number): Observable<void>      { return this.http.delete<void>(`${this.url}/${id}`); }
  addMember(projectId: number, userId: number): Observable<Project> {
    return this.http.post<Project>(`${this.url}/${projectId}/members/${userId}`, {});
  }
}
