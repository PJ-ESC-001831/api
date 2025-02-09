import { Router } from 'express';
import { createTransaction, findTransactionByPublicId } from './controller';
import { validateObject } from '@src/lib/utils/validation';
import {
  createTransactionRequestSchema,
  getTransactionByPublicIdRequestSchema,
} from './validation';
import { ObjectsToValidate } from '@src/lib/utils/validation/enums';

const route = Router();

/**
 * Route for creating a transaction.
 */
route.post(
  '/',
  validateObject(createTransactionRequestSchema),
  createTransaction,
);

/**
 * Route for retrieving a transaction by publicId.
 */
route.get(
  '/:publicId',
  validateObject(
    getTransactionByPublicIdRequestSchema,
    ObjectsToValidate.PARAMS,
  ),
  findTransactionByPublicId,
);

export default {
  v1: route,
};
