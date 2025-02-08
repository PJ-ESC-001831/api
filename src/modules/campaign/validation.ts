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

/**
 * Schema for validating the request to get a campaign by publicId.
 */
export const campaignByPublicIdRequestSchema = z.object({
  /**
   * The ID of the campaign to retrieve.
   *
   * @example 1
   */
  publicId: z.string(),
});

/**
 * Schema for validating the request to get a campaign by publicId.
 */
export const campaignByIdRequestSchema = z.object({
  /**
   * The ID of the campaign to retrieve.
   *
   * @example 1
   */
  id: z.string(),
});

/**
 * Schema for the request body of the updateCampaign endpoint.
 */
export const updateCampaignRequestSchema = z.object({
  /**
   * This is the title that will show on the campaign page as a heading.
   *
   * @example "Updated Campaign Title"
   */
  title: z.string().min(1).optional(),

  /**
   * This is the description that will show on the campaign page as a description.
   *
   * @example "This is an updated description of my campaign."
   */
  description: z.string().min(1).optional(),

  /**
   * This is the base cost of the campaign. It is optional so that you can set it later, and there
   * might be cases of having a campaign where there is no cost.
   *
   * @example 150.5
   */
  costBase: z.number().positive().optional(),

  /**
   * This is the URL to the Tradesafe checkout page. It is optional so that you can set it later
   * after the checkout was updated.
   */
  checkoutLink: z.string().optional(),

  /**
   * This is the ID of the seller that created the campaign.
   *
   * @example 2
   */
  sellerId: z.number().int().positive().optional(),
});

/**
 * Schema for a list of file uploads.
 */
export const fileUploadListSchema = z.array(
  z.object({
    /**
     * The buffer containing the file data.
     */
    buffer: z
      .any()
      .refine((value) => value instanceof Buffer && Buffer.byteLength(value) > 0, {
        message: 'Must be a valid image file',
      })
      .refine((value) => Buffer.byteLength(value) <= 10 * 1024 * 1024, {
        message: 'The image file size must be less than 10 MB',
      }),

    /**
     * The encoding type of the file.
     */
    encoding: z.string(),

    /**
     * The field name in the form data.
     */
    fieldname: z.string(),

    /**
     * The MIME type of the file.
     */
    mimetype: z.string(),

    /**
     * The original name of the file.
     */
    originalname: z.string(),
  })
).min(1);
