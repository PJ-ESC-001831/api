import { z } from 'zod';

/**
 * Schema for the request body of the createCampaign endpoint.
 */
export const createCampaignRequestSchema = z.object({
  /**
   * This is the title that will show on the campaign page as a heading.
   *
   * @example "My Campaign"
   */
  title: z.string().min(1),

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
  costBase: z.number().int().positive().optional(),

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
