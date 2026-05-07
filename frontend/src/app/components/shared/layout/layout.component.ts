// src/app/components/shared/layout/layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(public auth: AuthService, private router: Router) {}

  get initials(): string {
    return this.auth.currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}
