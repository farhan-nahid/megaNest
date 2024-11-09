import type { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { AnyZodObject, ZodError } from "zod";

const validateResource =
  (schema: AnyZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const reqSchema = await schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = reqSchema.body;
      req.params = reqSchema.params;
      req.query = reqSchema.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(createError(400, { errors: error.errors, stack: error?.stack }));
      } else {
        next();
      }
    }
  };

export { validateResource };
