import { Router } from 'express';

import { campaignDetails, createCampaign } from './controller';
// import { validateObject } from '@utils/validation';
// import {
//   createCampaignRequestSchema,
//   getCampaignByIdRequestSchema,
// } from './validation';
// import { ObjectsToValidate } from '@src/utils/validation/enums';

const route = Router();

/**
 * Route for retrieving a campaign by its ID.
 * The ID is passed as a URL parameter.
 */
route
  // .use(validateObject(getCampaignByIdRequestSchema, ObjectsToValidate.QUERY))
  .get('/:id', campaignDetails);

/**
 * Route for creating a new campaign.
 * Validates for valid campaign data in the request body.
 */
route
  // .use(validateObject(createCampaignRequestSchema))
  .post('/', createCampaign);

export default {
  v1: route,
};
