import { NextFunction, Request, Response } from 'express';
import { labeledLogger } from '../logger';
import { createNewTransaction } from '.';

const logger = labeledLogger('module:transaction/controller');
/**
 * Creates a new transaction in the database.
 * @param request - The incoming HTTP request object containing transaction data.
 * @param response - The HTTP response object used to send back the response.
 * @param next - The next middleware function in the Express stack.
 * @returns A Promise that resolves to the created transaction or calls the next middleware with an error.
 */
export async function createTransaction(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const { campaignId = null, buyerId = null, amount = null } = request.body;

    logger.info(
      `Creating new transaction from buyerId: ${buyerId} with amount of ${amount} for campaignId: ${campaignId}.`,
    );

    

    const transaction = await createNewTransaction({
      amount,
      campaignId,
      buyerId,
      transactionId,
    });

    return response.status(200).json({ data: transaction });
  } catch (error) {
    logger.error('Error creating transaction:', error);
    next(error);
  }
}