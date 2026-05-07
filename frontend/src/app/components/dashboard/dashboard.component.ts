// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Project, Task } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  tasks: Task[] = [];
  loading = true;

  constructor(
    public auth: AuthService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    forkJoin([this.projectService.getAll(), this.taskService.getAll()]).subscribe({
      next: ([projects, tasks]) => {
        this.projects = projects;
        this.tasks = tasks;
        this.loading = false;
      }
    });
  }

  get firstName(): string { return this.auth.currentUser?.name.split(' ')[0] || ''; }
  get myTasks(): Task[]   { return this.tasks.filter(t => t.assignee.id === this.auth.currentUser?.id); }
  get inProgress(): Task[]{ return this.tasks.filter(t => t.status === 'IN_PROGRESS'); }
  get done(): Task[]      { return this.tasks.filter(t => t.status === 'DONE'); }
  get overdue(): Task[]   {
    return this.tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');
  }

  progress(p: Project): number {
    return p.taskCount ? Math.round((p.doneCount / p.taskCount) * 100) : 0;
  }

  isOverdue(task: Task): boolean {
    return !!task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
  }

  priorityColor(p: string): string {
    return ({ HIGH: '#ff5a6e', MEDIUM: '#ffaa3b', LOW: '#5a9eff' } as Record<string,string>)[p] ?? '#6b7080';
  }

  statusLabel(s: string): string {
    return ({ TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' } as Record<string,string>)[s] ?? s;
  }

  statusClass(s: string): string {
    return ({ TODO: 'todo', IN_PROGRESS: 'in-progress', DONE: 'done' } as Record<string,string>)[s] ?? '';
  }
}
