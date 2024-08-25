import { Router } from 'express';

import { healthCheck } from './controller';

const route = Router();

route.get('/check', healthCheck);

export default {
  v1: route,
};
