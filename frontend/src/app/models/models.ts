// src/app/models/models.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  color: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  members: User[];
  taskCount: number;
  doneCount: number;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  projectId: number;
  projectName: string;
  assignee: User;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface TaskRequest {
  title: string;
  projectId: number;
  assigneeId: number;
  priority: string;
  status: string;
  dueDate: string | null;
}
