import crypto from 'crypto';

import DbConnection from '@database/client';
import { adjustCostBase } from '@src/lib/utils/finance';
import { Transaction } from './types';
import { createTransactionRecord } from './repository';
import { labeledLogger } from '../logger';
import { getCampaignById, getCampaignByPublicId } from '../campaign';
import { getBuyer } from '../user/repository';
import { getCampaignWithSeller } from '../campaign/repository';
import { CampaignNotFoundError } from '../campaign/errors';
import { createTransaction } from '@src/lib/tradesafe/src/transactions';
import GraphQLClient from '@src/lib/tradesafe/src/client';

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

  const [buyerData, campaignData] = await Promise.all([
    getBuyer(transactionData.buyerId, db),
    getCampaignWithSeller(transactionData.campaignId, db),
  ]);

  const costAdjustedCampaign = adjustCostBase(campaignData?.campaigns, true);
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
        value: campaignData?.campaigns.costBase as number,

        // TODO 2025-02-08: We will have to change how this is done.
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

  const response = await createTransactionRecord(db, {
    ...{
      campaignId: transactionData.campaignId,
      transactionId: tradesafeTransaction?.id,
    },
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
  const campaign = await getCampaignById(campaignId);

  if (!campaign)
    throw new CampaignNotFoundError(
      `Unable to find campaign with id: ${campaignId} whilst generating a reference for a transaction.`,
    );

  const hash = crypto
    .createHash('sha256')
    .update(`${campaign.publicId}${transactionId}${new Date().toISOString()}`)
    .digest('hex');

  return `TRC-${hash.substring(0, 6)}-${hash.substring(8, 16)}`;
}
