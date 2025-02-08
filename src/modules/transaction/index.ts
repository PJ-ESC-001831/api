import crypto from 'crypto';

import DbConnection from '@database/client';
import { adjustCostBase } from '@src/lib/utils/finance';
import { Transaction } from './types';
import { createTransactionRecord } from './repository';
import { labeledLogger } from '../logger';
import { getCampaignByPublicId } from '../campaign';
import { getBuyer } from '../user/repository';
import { getCampaignWithSeller } from '../campaign/repository';

const database = new DbConnection().configure();
const logger = labeledLogger('module:transaction');

export async function createNewTransaction(
  transactionData: Pick<Transaction, 'campaignId' | 'buyerId'>,
): Promise<Pick<Transaction, 'id' | 'reference'>> {
  const db = (await database).getDb();

  const [buyerData, campaignData] = await Promise.all([
    getBuyer(transactionData.buyerId, db),
    getCampaignWithSeller(transactionData.campaignId, db),
  ]);

  const costAdjustedTransaction = adjustCostBase(transactionData);
  const response = await createTransactionRecord(db, {
    ...costAdjustedTransaction,
    reference: await generateReference(transactionData.campaignId, 'test'),
  } as Transaction);

  if (!response) {
    logger.error('Failed to create campaign.');
    throw new Error('Failed to create campaign.');
  }

  return response;
}

export async function generateReference(
  campaignId: number,
  transactionId: string,
): Promise<string> {
  const campaign = await getCampaignByPublicId(campaignId);

  const hash = crypto
    .createHash('sha256')
    .update(`${campaign.uuid}${transactionId}${new Date().toISOString()}`)
    .digest('hex');

  return `TRC-${hash.substring(0, 6)}-${hash.substring(8, 16)}`;
}
