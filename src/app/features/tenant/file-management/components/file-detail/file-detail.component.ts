import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FileManagementService } from '../../../../../core/services/file-management.service';
import { FileDetailDto, FileErrorInlineDto } from '../../../../../core/models/file-management.models';
import { Observable, finalize } from 'rxjs';

@Component({
  selector: 'app-file-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.css']
})
export class FileDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fileManagementService = inject(FileManagementService);

  fileDetail$!: Observable<FileDetailDto>;
  
  errors: FileErrorInlineDto[] = [];
  isLoadingErrors = false;
  
  // Pagination for errors
  currentPage = 0;
  pageSize = 10;
  isLastPage = false;

  ngOnInit(): void {
    const fileNumber = this.route.snapshot.paramMap.get('fileNumber');
    if (fileNumber) {
      this.fileDetail$ = this.fileManagementService.getFileDetails(fileNumber);
      this.loadErrors(fileNumber);
    }
  }

  loadErrors(fileNumber: string): void {
    this.isLoadingErrors = true;
    this.fileManagementService.getErrorsForFile(fileNumber, this.currentPage, this.pageSize)
      .pipe(finalize(() => this.isLoadingErrors = false))
      .subscribe({
        next: (response) => {
          this.errors = response.content;
          this.isLastPage = response.last;
        },
        error: (err) => {
          console.error('Error loading file errors:', err);
          this.errors = [];
        }
      });
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      const fileNumber = this.route.snapshot.paramMap.get('fileNumber');
      if (fileNumber) {
        this.loadErrors(fileNumber);
      }
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      const fileNumber = this.route.snapshot.paramMap.get('fileNumber');
      if (fileNumber) {
        this.loadErrors(fileNumber);
      }
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'UPLOADED': return 'bg-info text-dark';
      case 'PROCESSING': return 'bg-warning text-dark';
      case 'PARTIALLY_COMPLETED': return 'bg-warning-soft text-warning border-warning';
      case 'COMPLETED': return 'bg-success text-white';
      case 'FAILED': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }
}
