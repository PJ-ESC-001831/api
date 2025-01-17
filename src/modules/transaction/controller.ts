import { NextFunction, Request, Response } from 'express';
import { labeledLogger } from '../logger';
import { createNewTransaction } from '.';

const logger = labeledLogger('module:transaction/controller');

export async function createTransaction(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> {
  let {
    campaignId = null,
    buyerId = null,
    amount = null,
    transactionId = null,
  } = request.body;
  logger.info(
    `Creating new transaction from buyerId: ${buyerId} with amount of ${amount} for campaignId: ${campaignId}.`,
  );

  if (transactionId === null) transactionId = 'test-transaction';

  const transaction = await createNewTransaction({
    amount,
    campaignId,
    buyerId,
    transactionId,
  });

  response.status(200).json({ data: transaction });
}
