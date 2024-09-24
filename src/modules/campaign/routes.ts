import { Router } from 'express';

import { campaignDetails, createCampaign } from '.';
import { validate } from '@utils/validation';
import { createCampaignRequestSchema } from './validation';

const route = Router();

route.use(validate(createCampaignRequestSchema)).post('/', createCampaign);
route.get('/:id', campaignDetails);

export default {
  v1: route,
};
