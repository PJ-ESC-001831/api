import { Router } from 'express';

import { campaignDetails } from '.';
import { createCampaign } from './service';

const route = Router();

route.post('/', createCampaign);
route.get('/:id', campaignDetails);

export default {
  v1: route,
};
