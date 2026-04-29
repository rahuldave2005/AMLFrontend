import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserManagementService } from '../../../../../core/services/user-management.service';

@Component({
  selector: 'app-register-compliance-officer',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register-compliance-officer.component.html',
  styleUrl: './register-compliance-officer.component.css'
})
export class RegisterComplianceOfficerComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userManagementService = inject(UserManagementService);
  private readonly router = inject(Router);

  registerForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      employeeCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userManagementService.registerComplianceOfficer(this.registerForm.value).subscribe({
      next: (response) => {
        this.successMessage = `Compliance officer ${response.employeeCode} registered successfully!`;
        this.isSubmitting = false;
        // Optional: Redirect after a short delay
        setTimeout(() => this.router.navigate(['/tenant/user-management']), 2000);
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMessage = err.error?.message || 'Registration failed. Please check your inputs and try again.';
        this.isSubmitting = false;
      }
    });
  }
}
