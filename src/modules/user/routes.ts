import { validate } from '@src/utils/validation';
import { Router } from 'express';
import { createUserRequestSchema } from './validation';
import { createSeller } from './controller';

const route = Router();
route.use(validate(createUserRequestSchema)).post('/', createSeller);
