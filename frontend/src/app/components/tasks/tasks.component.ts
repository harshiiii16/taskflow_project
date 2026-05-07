// src/app/components/tasks/tasks.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Task, Project, User, TaskRequest } from '../../models/models';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  projects: Project[] = [];
  users: User[] = [];
  statusFilter = 'all';
  projectFilter = 'all';
  showModal = false;
  isEdit = false;
  form: Partial<TaskRequest> & { id?: number } = {};

  constructor(
    public auth: AuthService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.taskService.getAll(),
      this.projectService.getAll(),
      this.userService.getAll()
    ]).subscribe(([tasks, projects, users]) => {
      this.tasks = tasks;
      this.projects = projects;
      this.users = users;
    });
  }

  get filtered(): Task[] {
    return this.tasks.filter(t => {
      const statusOk = this.statusFilter === 'all' || t.status === this.statusFilter ||
        (this.statusFilter === 'overdue' && this.isOverdue(t));
      const projOk = this.projectFilter === 'all' || String(t.projectId) === this.projectFilter;
      return statusOk && projOk;
    });
  }

  isOverdue(t: Task): boolean {
    return !!t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE';
  }

  toggle(task: Task): void {
    this.taskService.toggleDone(task).subscribe(updated => {
      const idx = this.tasks.findIndex(t => t.id === task.id);
      if (idx > -1) this.tasks[idx] = updated;
    });
  }

  openNew(): void {
    this.form = { priority: 'MEDIUM', status: 'TODO' };
    this.isEdit = false;
    this.showModal = true;
  }

  openEdit(task: Task): void {
    this.form = {
      id: task.id,
      title: task.title,
      projectId: task.projectId,
      assigneeId: task.assignee.id,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    };
    this.isEdit = true;
    this.showModal = true;
  }

  save(): void {
    if (!this.form.title || !this.form.projectId || !this.form.assigneeId) return;
    const req = this.form as TaskRequest;
    if (this.isEdit && this.form.id) {
      this.taskService.update(this.form.id, req).subscribe(updated => {
        const idx = this.tasks.findIndex(t => t.id === this.form.id);
        if (idx > -1) this.tasks[idx] = updated;
        this.showModal = false;
      });
    } else {
      this.taskService.create(req).subscribe(created => {
        this.tasks = [created, ...this.tasks];
        this.showModal = false;
      });
    }
  }

  deleteTask(): void {
    if (!this.form.id) return;
    this.taskService.delete(this.form.id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== this.form.id);
      this.showModal = false;
    });
  }

  priorityColor(p: string): string {
    return { HIGH: '#ff5a6e', MEDIUM: '#ffaa3b', LOW: '#5a9eff' }[p] || '#6b7080';
  }

  statusLabel(s: string): string {
    return { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }[s] || s;
  }
}
