import { Request, Response, NextFunction } from 'express';
import { createUserRecord } from '.';

/**
 * Creates a user based on the provided userType in the request body.
 *
 * @param {Request} req The request object containing user data.
 * @param {Response} res The response object used to send the response.
 * @param {NextFunction} next The next middleware function in the stack.
 * @return {Promise<void>} A promise that resolves to void.
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { userType, ...userData } = req.body;

  try {
    let user;
    user = await createUserRecord(userData, userType);
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

