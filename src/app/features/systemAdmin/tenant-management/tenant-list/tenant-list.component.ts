import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TenantInlineDto } from '../../../../core/models/tenant.models';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenant-list.component.html',
  styleUrl: './tenant-list.component.css'
})
export class TenantListComponent {
  @Input() tenants: TenantInlineDto[] = [];
  @Output() onViewDetails = new EventEmitter<string>();
}
