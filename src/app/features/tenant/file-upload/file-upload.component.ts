import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileType, FileUploadProcessDto } from '../../../core/models/file-upload.models';
import { FileUploadService } from '../../../core/services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  private readonly fileUploadService = inject(FileUploadService);
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileTypes = FileType;
  selectedType: FileType | null = null;
  selectedFile: File | null = null;
  
  isDragging = false;
  isUploading = false;
  
  uploadResult: FileUploadProcessDto | null = null;
  errorMessage = '';

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    if (file.name.toLowerCase().endsWith('.csv')) {
      this.selectedFile = file;
      this.errorMessage = '';
    } else {
      this.selectedFile = null;
      this.errorMessage = 'Please select a valid CSV file.';
    }
  }

  clearSelection(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFile = null;
    this.uploadResult = null;
    this.errorMessage = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  upload(): void {
    if (!this.selectedFile || !this.selectedType) return;

    this.isUploading = true;
    this.uploadResult = null;
    this.errorMessage = '';

    this.fileUploadService.uploadFile(this.selectedFile, this.selectedType).subscribe({
      next: (result) => {
        this.uploadResult = result;
        this.isUploading = false;
        // Reset file selection after successful upload
        this.selectedFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.errorMessage = err.error?.message || 'An error occurred during file upload. Please try again.';
        this.isUploading = false;
      }
    });
  }
}
