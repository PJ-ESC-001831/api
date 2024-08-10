import { Router } from 'express';

import { campaignDetails } from './controller';

const route = Router();

route.get('/:id', campaignDetails);

export default {
  v1: route,
};
