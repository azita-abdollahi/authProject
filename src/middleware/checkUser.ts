import { NextFunction, Request, Response } from 'express'; 
import { AuthorizeException } from '../utils/appError';


export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (!user) {
        res.statusCode = 401;
        return next(new AuthorizeException(`Invalid token or session has expired`));
    }
    next();
  } catch (err: any) {
    next(err);
  }
};

