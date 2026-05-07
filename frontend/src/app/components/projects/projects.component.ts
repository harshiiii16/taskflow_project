// src/app/components/projects/projects.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Project, Task } from '../../models/models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  tasks: Task[] = [];
  showNewModal = false;
  selectedProject: Project | null = null;
  form = { name: '', description: '' };

  constructor(
    public auth: AuthService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.projectService.getAll().subscribe(p => this.projects = p);
    this.taskService.getAll().subscribe(t => this.tasks = t);
  }

  progress(p: Project): number {
    return p.taskCount ? Math.round((p.doneCount / p.taskCount) * 100) : 0;
  }

  projectTasks(p: Project): Task[] {
    return this.tasks.filter(t => t.projectId === p.id);
  }

  create(): void {
    if (!this.form.name) return;
    this.projectService.create(this.form).subscribe(p => {
      this.projects = [p, ...this.projects];
      this.form = { name: '', description: '' };
      this.showNewModal = false;
    });
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
