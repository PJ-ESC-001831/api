import { transactions } from '@database/schema/transactions';

export type Transaction = typeof transactions.$inferInsert;
