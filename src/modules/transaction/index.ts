import DbConnection from '@database/client';
import { adjustCostBase } from '@src/lib/utils/finance';
import { Transaction } from './types';
import { createTransactionRecord } from './repository';
import { labeledLogger } from '../logger';
import { getBuyer } from '../user/repository';
import { getCampaignWithSeller } from '../campaign/repository';
import {
  createCheckoutLink,
  createTransaction,
} from '@src/lib/tradesafe/src/transactions';
import GraphQLClient from '@src/lib/tradesafe/src/client';
import { FailedToCreateTransactionError } from './errors';
import { generatePublicId } from '@src/lib/utils/string';
import { Transaction as TradeSafeTransaction } from '@src/lib/tradesafe/src/types';

const database = new DbConnection().configure();
const logger = labeledLogger('module:transaction');

const tradesafeClient = new GraphQLClient().config(
  process.env.TRADESAFE_CLIENT_ID as string,
  process.env.TRADESAFE_SECRET as string,
);

/**
 * Creates a new transaction record in the system.
 *
 * @param {Pick<Transaction, 'campaignId' | 'buyerId'>} transactionData - The transaction details, including campaign ID and buyer ID.
 * @param {string} [allocationTitle='General Sales Allocation'] - The title for the transaction allocation.
 * @returns {Promise<Pick<Transaction, 'id' | 'publicId'>>} The created transaction’s ID and public ID.
 * @throws {FailedToCreateTransactionError} If the TradeSafe API fails to return a transaction.
 * @throws {Error} If the transaction record fails to be created in the database.
 */
export async function createNewTransaction(
  transactionData: Pick<Transaction, 'campaignId' | 'buyerId'>,
  addTransaction = false,
  addCheckoutLink = false,

  /**
   * TODO: You can replace this with the detailed description. Like XL-Blue-Shirt
   */
  allocationTitle = 'Purchase',
): Promise<Pick<Transaction, 'id' | 'publicId'>> {
  const db = (await database).getDb();

  await tradesafeClient.authenticate();

  const [buyerData, campaignData] = await Promise.all([
    getBuyer(transactionData.buyerId, db),
    getCampaignWithSeller(transactionData.campaignId, db),
  ]);

  let tradesafeTransaction: Pick<TradeSafeTransaction, 'id'> | undefined;
  if (addTransaction) {
    tradesafeTransaction = await createTransaction(tradesafeClient, {
      title: campaignData?.campaigns.title as string,
      description: campaignData?.campaigns.description as string,
      industry: 'GENERAL_GOODS_SERVICES',
      currency: 'ZAR',
      feeAllocation: 'SELLER',
      allocations: [
        {
          title: allocationTitle,
          description: 'General allocation.',
          value: adjustCostBase(campaignData?.campaigns, true)
            .costBase as number,

          /**
           * TODO 2025-02-08: Improve delivery time calculation.
           *
           * This logic should be driven by a JSON object within the campaign.
           * - If there's a specific deliver-by date, calculate the days difference.
           * - If the campaign requires a minimum number of orders, dynamically adjust
           *   the allocation for all related transactions.
           */
          daysToDeliver: 7,
          daysToInspect: 7,
        },
      ],
      parties: [
        { token: buyerData?.buyers.tokenId as string, role: 'BUYER' },
        { token: campaignData?.sellers?.tokenId as string, role: 'SELLER' },
      ],
    });

    if (!tradesafeTransaction) {
      logger.error('TradeSafe API did not return a transaction.');
      throw new FailedToCreateTransactionError(
        'Nothing received from the TradeSafe API when creating a transaction.',
      );
    }
  }

  let checkoutLink: string | undefined;
  if (addCheckoutLink) {
    checkoutLink = await createCheckoutLink(
      tradesafeClient,
      tradesafeTransaction.id,
    );
  }

  const response = await createTransactionRecord(db, {
    campaignId: transactionData.campaignId,
    transactionId: tradesafeTransaction?.id,
    buyerId: buyerData?.buyers.id,
    balance: 0, // Initial balance set to 0; updated upon payment.
    publicId: generatePublicId(),
    checkoutLink,
  } as Transaction);

  if (!response) {
    logger.error('Failed to create transaction record in the database.');
    throw new Error('Failed to create transaction.');
  }

  return response;
}
