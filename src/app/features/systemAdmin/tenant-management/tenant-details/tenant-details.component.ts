import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TenantDetailsDto } from '../../../../core/models/tenant.models';

@Component({
  selector: 'app-tenant-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenant-details.component.html',
  styleUrl: './tenant-details.component.css'
})
export class TenantDetailsComponent {
  @Input() details: TenantDetailsDto | null = null;
  @Output() onClose = new EventEmitter<void>();
}
