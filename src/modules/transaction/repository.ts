import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { labeledLogger } from '../logger';
import { Transaction } from './types';
import UndefinedDatabaseClientError from '@src/lib/errors/UndefinedDatabaseClientError';
import { transactions } from '@src/database/schema/transactions';
import { FailedToCreateTransactionError } from './errors';

const logger = labeledLogger('module:transaction/repository');

export async function createTransactionRecord(
  db: NodePgDatabase<Record<string, never>> | undefined,
  transactionData: Transaction,
): Promise<Pick<Transaction, 'id' | 'reference'>> {
  if (!db) {
    throw new UndefinedDatabaseClientError();
  }

  logger.info(
    `Creating a new transaction for campaign ${transactionData.campaignId} for a amount of ${transactionData.amount}.`,
  );

  const transaction = await db
    .insert(transactions)
    .values(transactionData)
    .returning({ id: transactions.id, reference: transactions.reference })
    .execute();

  if (!transaction || !transaction.length)
    throw new FailedToCreateTransactionError();

  return transaction[0];
}
