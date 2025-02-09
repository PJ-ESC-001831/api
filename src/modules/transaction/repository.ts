import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { labeledLogger } from '../logger';
import { Transaction } from './types';
import UndefinedDatabaseClientError from '@src/lib/errors/UndefinedDatabaseClientError';
import { transactions } from '@src/database/schema/transactions';
import {
  FailedToCreateTransactionError,
  TransactionNotFoundError,
} from './errors';
import { eq } from 'drizzle-orm';
import { campaigns } from '@src/database/schema/campaigns';
import { Campaign } from '../campaign/types';

const logger = labeledLogger('module:transaction/repository');

/**
 * Creates a new transaction record in the database.
 *
 * @param {NodePgDatabase<Record<string, never>> | undefined} db - The database client instance.
 * @param {Transaction} transactionData - The transaction details to be inserted.
 * @returns {Promise<Pick<Transaction, 'id' | 'publicId'>>} The newly created transaction's ID and public ID.
 * @throws {UndefinedDatabaseClientError} If the database client is undefined.
 * @throws {FailedToCreateTransactionError} If the transaction creation fails.
 */
export async function createTransactionRecord(
  db: NodePgDatabase<Record<string, never>> | undefined,
  transactionData: Transaction,
): Promise<Pick<Transaction, 'id' | 'publicId'>> {
  if (!db) {
    console.error('Database client is undefined.');
    throw new UndefinedDatabaseClientError();
  }

  logger.info(
    `Creating transaction for campaign ${transactionData.campaignId}.`,
  );

  const result = await db
    .insert(transactions)
    .values(transactionData)
    .returning({
      id: transactions.id,
      publicId: transactions.publicId,
      checkoutLink: transactions.checkoutLink,
    })
    .execute();

  if (!result?.length) {
    console.error('Failed to create transaction:', transactionData);
    throw new FailedToCreateTransactionError();
  }

  return result[0];
}

export async function getTransactionRecordByPublicId(
  db: NodePgDatabase<Record<string, never>> | undefined,
  publicId: string,
  includeCampaign: boolean = false,
): Promise<(Transaction & { campaign?: Campaign }) | null> {
  if (!db) {
    console.error('Database client is undefined.');
    throw new UndefinedDatabaseClientError();
  }

  logger.info(`Getting ransaction with publicId: ${publicId}.`);

  const query = db.select().from(transactions);

  if (includeCampaign) {
    query.leftJoin(campaigns, eq(campaigns.id, transactions.campaignId));
  }

  const results = await query
    .where(eq(transactions.publicId, publicId))
    .execute();

  if (results.length === 0) throw new TransactionNotFoundError();

  let transactionData: Transaction & { campaign?: Campaign };
  if (includeCampaign) {
    const transactionCollection = results[0] as unknown as {
      transactions: Transaction;
      campaigns?: Campaign;
    };

    transactionData = {
      ...transactionCollection.transactions,
      campaign: transactionCollection.campaigns,
    };
  } else {
    transactionData = results[0];
  }

  return transactionData;
}