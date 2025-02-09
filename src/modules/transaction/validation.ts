import { z } from 'zod';

/**
 * Schema for the request body of the createCampaign endpoint.
 */
export const createTransactionRequestSchema = z
  .object({
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
     * This is a bool to generate a TradeSafe transaction. You will need to do this
     * before creating the checkout link.
     *
     * @example true
     */
    addTransaction: z.boolean().optional(),

    /**
     * This is a bool to generate a checkout link for the transaction. Either yes
     * here or you update the transaction with the link later.
     *
     * @example true
     */
    addCheckoutLink: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.addCheckoutLink && !data.addTransaction) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'addCheckoutLink can only be true if addTransaction is also true.',
        path: ['addCheckoutLink'],
      });
    }
  });;
