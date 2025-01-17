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


  /**
   * This is the description that will show on the campaign page as a description.
   *
   * @example "This is a description of my campaign."
   */
  description: z.string().min(1),

  /**
   * This is the base cost of the campaign. It is optional so that you can set it later, and there
   * might be cases of having a campaign where there is no cost.
   *
   * @example 100
   */
  costBase: z.number().positive().optional(),

  /**
   * This is the URL to the Tradesafe checkout page. It is optional so that you can set it later
   * after the checkout was created.
   */
  checkoutLink: z.string().optional(),

  /**
   * This is the ID of the seller that created the campaign.
   *
   * @example 1
   */
  sellerId: z.number().int().positive(),
});
