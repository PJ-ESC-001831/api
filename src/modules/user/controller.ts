import { Request, Response, NextFunction } from 'express';

const database = new DbConnection().configure();

export const createSellerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    emailAddress,
    phoneNumber,
    firstName,
    lastName,
    profile = {},
  } = req.body;

  try {
    
  } catch (error) {
    next(error);
  }
};
