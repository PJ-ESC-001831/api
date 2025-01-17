import { transactions } from '@database/schema/transactions';

export type Transaction = typeof transactions.$inferInsert;

export enum TransactionStateEnum {
  PAID = 'paid',
  PARTIAL = 'partial',
  PROCESSED = 'processed',
  ABORTED = 'aborted',
  PROBLEM = 'problem',
}
