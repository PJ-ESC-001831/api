import { z } from 'zod';

/**
 * Schema for the request body of the createCampaign endpoint.
 */
export const createTransactionRequestSchema = z.object({
  /**
   * This is the ID of the campaign that the transaction will be associated with.
   *
   * @example 1
   */
  campaignId: z.number().positive(),

  /**
   * This is the ID of the buyer that the transaction will be associated with.
   *
   * @example 2
   */
  buyerId: z.number().positive(),
});
