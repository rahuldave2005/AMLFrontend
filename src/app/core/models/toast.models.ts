export interface Toast {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
}
