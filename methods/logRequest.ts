import { Request } from 'express';

export const logRequest = (req: Request, message: string): void => {
  console.log(req.method, req.httpVersion, message);
};
