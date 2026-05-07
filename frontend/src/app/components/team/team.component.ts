// src/app/components/team/team.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/models';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  users: User[] = [];

  constructor(public auth: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe(u => this.users = u);
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleRole(user: User): void {
    if (user.id === this.auth.currentUser?.id) return;
    const newRole = user.role === 'ADMIN' ? 'MEMBER' : 'ADMIN';
    this.userService.updateRole(user.id, newRole).subscribe(updated => {
      const idx = this.users.findIndex(u => u.id === user.id);
      if (idx > -1) this.users[idx] = updated;
    });
  }

  remove(user: User): void {
    if (user.id === this.auth.currentUser?.id) return;
    this.userService.delete(user.id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== user.id);
    });
  }
}
