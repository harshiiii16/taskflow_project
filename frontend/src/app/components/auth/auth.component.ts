// src/app/components/auth/auth.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  tab: 'login' | 'signup' = 'login';
  error = '';
  form = { name: '', email: '', password: '', role: 'Member' };

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    if (this.tab === 'login') {
      this.auth.login({ email: this.form.email, password: this.form.password }).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.error = 'Invalid email or password'
      });
    } else {
      if (!this.form.name || !this.form.email || !this.form.password) {
        this.error = 'Please fill all fields'; return;
      }
      this.auth.register(this.form).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (e) => this.error = e.error?.message || 'Registration failed'
      });
    }
  }
}
