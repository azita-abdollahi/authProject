import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import SchemaValidationException  from '../utils/appError';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        throw new SchemaValidationException("Schema Validation Error!");
      }
      console.error(err);
      next(err);
    }
  };

