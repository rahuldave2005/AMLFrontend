import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast.models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', title?: string) {
    const toast: Toast = { message, type, title };
    this.toasts.update(t => [...t, toast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      this.remove(toast);
    }, 5000);
  }

  success(message: string, title: string = 'Success') {
    this.show(message, 'success', title);
  }

  error(message: string, title: string = 'Error') {
    this.show(message, 'danger', title);
  }

  warning(message: string, title: string = 'Warning') {
    this.show(message, 'warning', title);
  }

  remove(toast: Toast) {
    this.toasts.update(t => t.filter(x => x !== toast));
  }
}
