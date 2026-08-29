import type { Customer } from '@/lib/types';

export type ProcessedCustomer = Customer & {
  daysSinceVisit: number;
  calculatedStatus: Customer['status'];
};

export interface CustomerHistoryItem {
  id: string;
  date: string;
  time: string;
  service: string;
  branch: string;
  price: number;
  status: string;
}
