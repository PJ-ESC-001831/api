import crypto from 'crypto';

import DbConnection from '@database/client';
import { adjustCostBase } from '@src/lib/utils/finance';
import { Transaction } from './types';
import { createTransactionRecord } from './repository';
import { labeledLogger } from '../logger';
import { getBuyer } from '../user/repository';
import { getCampaignWithSeller } from '../campaign/repository';
import { CampaignNotFoundError } from '../campaign/errors';
import { createTransaction } from '@src/lib/tradesafe/src/transactions';
import GraphQLClient from '@src/lib/tradesafe/src/client';
import { FailedToCreateTransactionError } from './errors';
import { generatePublicId } from '@src/lib/utils/string';

const database = new DbConnection().configure();
const logger = labeledLogger('module:transaction');

const client = new GraphQLClient().config(
  process.env.TRADESAFE_CLIENT_ID as string,
  process.env.TRADESAFE_SECRET as string,
);

export async function createNewTransaction(
  transactionData: Pick<Transaction, 'campaignId' | 'buyerId'>,
  allocationTitle = 'General Sales Allocation',
): Promise<Pick<Transaction, 'id' | 'reference'>> {
  const db = (await database).getDb();
  await client.authenticate();

  const [buyerData, campaignData] = await Promise.all([
    getBuyer(transactionData.buyerId, db),
    getCampaignWithSeller(transactionData.campaignId, db),
  ]);

  const tradesafeTransaction = await createTransaction(client, {
    title: campaignData?.campaigns.title as string,
    description: campaignData?.campaigns.description as string,
    industry: 'GENERAL_GOODS_SERVICES',
    currency: 'ZAR',
    feeAllocation: 'SELLER',
    allocations: [
      {
        title: allocationTitle,
        description: `General allocation.`,
        value: adjustCostBase(campaignData?.campaigns, true).costBase as number,

        /*
         * TODO 2025-02-08: We will have to change how this is done.
         *
         * I think we should have a JSON object in the campaign determines this. If there is a
         * deliver-by-date we put the difference between that and now here. If there is a lower
         * limit to the amount of orders that we need before we can deliver, then we keep
         * adjusting this for all of the allocations on all of the transactions that are related
         * to a campaign.
         */
        daysToDeliver: 7,
        daysToInspect: 7,
      },
    ],
    parties: [
      {
        token: buyerData?.buyers.tokenId as string,
        role: 'BUYER',
      },
      {
        token: campaignData?.sellers?.tokenId as string,
        role: 'SELLER',
      },
    ],
  });

  if (!tradesafeTransaction)
    throw new FailedToCreateTransactionError(
      'Nothing received from the TradeSafe API when creating a transaction.',
    );

  const response = await createTransactionRecord(db, {
    campaignId: transactionData.campaignId,
    transactionId: tradesafeTransaction?.id,
    buyerId: buyerData?.buyers.id,
    balance: 0, // User has not paid anything yet, will update later.
    reference: generatePublicId(),
  } as Transaction);

  if (!response) {
    logger.error('Failed to create campaign.');
    throw new Error('Failed to create campaign.');
  }

  return response;
}
