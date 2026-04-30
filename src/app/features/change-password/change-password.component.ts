import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isSubmitting = false;
  errorMsg = '';
  successMsg = '';

  onSubmit(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'New passwords do not match.';
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMsg = 'New password must be at least 8 characters.';
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMsg = 'User session not found.';
      return;
    }

    this.isSubmitting = true;
    this.authService.updatePassword({
      email: user.email,
      oldPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: (res) => {
        this.successMsg = 'Password updated successfully. Please log in again.';
        this.isSubmitting = false;
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMsg = err.error || 'Current password is incorrect or an error occurred.';
      }
    });
  }
}
