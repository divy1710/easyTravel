import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export function validateBody(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details.map(d => d.message) });
    }
    next();
  };
}
