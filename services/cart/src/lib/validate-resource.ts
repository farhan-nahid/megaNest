import type { NextFunction, Request, Response } from "express";

import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "./api-error";

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
        const { message, errors, issues } = error ?? {};
        next(new ApiError(400, message, { errors, issues }, "zod"));
      } else {
        next(error);
      }
    }
  };

export { validateResource };
