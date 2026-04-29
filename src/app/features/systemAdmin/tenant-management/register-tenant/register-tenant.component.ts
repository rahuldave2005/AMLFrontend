import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TenantService } from '../../../../core/services/tenant.service';

@Component({
  selector: 'app-register-tenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-tenant.component.html',
  styleUrl: './register-tenant.component.css'
})
export class RegisterTenantComponent {
  private readonly fb = inject(FormBuilder);
  private readonly tenantService = inject(TenantService);
  private readonly router = inject(Router);

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  readonly registerForm = this.fb.nonNullable.group({
    bankName: ['', [Validators.required, Validators.maxLength(100)]],
    ifsc: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
    contactEmail: ['', [Validators.required, Validators.email]],
    bankAdminEmail: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    middleName: ['', [Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    employeeCode: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-]{3,20}$/)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.registerForm.getRawValue();
    
    this.tenantService.registerBank(payload).subscribe({
      next: (response) => {
        this.successMessage = 'Bank registered successfully!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/tenantManagement']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to register bank. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.registerForm.get(controlName);
    return Boolean(control?.touched && control.hasError(errorName));
  }
}
