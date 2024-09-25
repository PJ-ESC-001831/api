import { validate } from '@src/utils/validation';
import { Router } from 'express';
import { createUserRequestSchema } from './validation';
import { createUser } from './controller';

const route = Router();
route.use(validate(createUserRequestSchema)).post('/', createUser);

export default {
  v1: route,
};
