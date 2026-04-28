import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface TransactionRecord {
  id: string;
  customer: string;
  amount: string;
  status: 'Reviewed' | 'Pending' | 'Escalated';
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  readonly transactions: TransactionRecord[] = [
    { id: 'TXN-10231', customer: 'Apex Holdings', amount: '$42,500', status: 'Reviewed' },
    { id: 'TXN-10232', customer: 'Nexus Finance', amount: '$11,900', status: 'Pending' },
    { id: 'TXN-10233', customer: 'Harbor Trade', amount: '$78,120', status: 'Escalated' }
  ];

  trackById(index: number, item: TransactionRecord): string {
    return item.id;
  }
}
