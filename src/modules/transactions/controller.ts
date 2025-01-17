import { NextFunction, Request, Response } from 'express';

export async function createTransaction(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> {
  return 'created campaign';
}
