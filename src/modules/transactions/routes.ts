import { Router } from 'express';
import { createTransaction } from './controller';
import { validateObject } from '@src/lib/utils/validation';
import { createTransactionRequestSchema } from './validation';

const route = Router();

/**
 * Route for creating a transaction.
 */
route.post(
  '/',
  validateObject(createTransactionRequestSchema),
  createTransaction,
);

export default {
  v1: route,
};
