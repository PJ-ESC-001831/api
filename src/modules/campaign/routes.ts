import { Router } from 'express';

import {
  getCampaign,
  patchCampaign,
  postCampaign,
  postCampaignImages,
} from './controller';
import { validateObject } from '@utils/validation';
import {
  createCampaignRequestSchema,
  campaignByIdRequestSchema,
  updateCampaignRequestSchema,
} from './validation';
import { ObjectsToValidate } from '@src/utils/validation/enums';

const route = Router();

/**
 * Route for retrieving a campaign by its ID.
 * The ID is passed as a URL parameter.
 */
route.get(
  '/:id',
  validateObject(campaignByIdRequestSchema, ObjectsToValidate.PARAMS),
  getCampaign,
);

/**
 * Route for attaching images to a campaign.
 */
route.post('/:id/images', postCampaignImages);

/**
 * Route for creating a new campaign.
 * Validates for valid campaign data in the request body.
 */
route.post('/', validateObject(createCampaignRequestSchema), postCampaign);

/**
 * Route for updating a campaign by its ID.
 * Validates for valid campaign data in the request body and a valid ID in the URL.
 */
route.patch(
  '/:id',
  validateObject(campaignByIdRequestSchema, ObjectsToValidate.PARAMS),
  validateObject(updateCampaignRequestSchema),
  patchCampaign,
);

export default {
  v1: route,
};
