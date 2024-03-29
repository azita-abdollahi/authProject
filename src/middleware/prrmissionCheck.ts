import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../utils/appError';

export const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!allowedRoles.includes(user.role)) {
        res.statusCode = 403;
        return next(new ForbiddenException('You are not allowed to perform this action'));
    }
    next();
  };

