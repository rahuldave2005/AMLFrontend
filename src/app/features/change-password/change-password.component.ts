import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  isSubmitting = false;
  errorMsg = '';
  successMsg = '';

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMsg = 'User session not found. Please log in again.';
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = '';
    this.successMsg = '';

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();

    this.authService.updatePassword({
      email: user.email,
      oldPassword: currentPassword!,
      newPassword: newPassword!
    }).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.successMsg = 'Password updated successfully. Redirecting to dashboard...';
        this.authService.completeFirstLogin();
        setTimeout(() => {
          void this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        if (typeof err.error === 'string') {
          this.errorMsg = err.error;
        } else if (err.error?.message) {
          this.errorMsg = err.error.message;
        } else {
          this.errorMsg = 'Current password is incorrect or an error occurred.';
        }
      }
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.passwordForm.get(controlName);
    return !!(control?.touched && control.hasError(errorName));
  }
}
