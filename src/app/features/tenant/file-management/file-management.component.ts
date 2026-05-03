import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileManagementService } from '../../../core/services/file-management.service';
import { FileInlineDto } from '../../../core/models/file-management.models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-file-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent implements OnInit {
  private readonly fileManagementService = inject(FileManagementService);

  files: FileInlineDto[] = [];
  isLoading = false;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  isLastPage = false;

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.isLoading = true;
    this.fileManagementService.getAllFiles(this.currentPage, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.files = response.content;
          this.isLastPage = response.last;
        },
        error: (err) => {
          console.error('Error loading files:', err);
          this.files = [];
        }
      });
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      this.loadFiles();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadFiles();
    }
  }
}
