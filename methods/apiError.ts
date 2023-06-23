import { Response } from 'express';

export const apiError = (err: Error, res: Response) => {
  console.error('suka', err);
  res.send('API ERROR').status(500);
};
