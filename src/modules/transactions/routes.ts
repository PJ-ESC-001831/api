import { Router } from 'express';
import { createTransaction } from './controller';

const route = Router();

/**
 * Route for creating a transaction.
 */
route.post('/', createTransaction);
