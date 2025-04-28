import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";

type ReqPart = "body" | "params" | "query";

export function makeValidator<T extends object>(
  dto: ClassConstructor<T>,
  part: ReqPart = "body"
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const payload = req[part] as object;

    const instance = plainToInstance(dto, payload);

    const errors = await validate(instance, { whitelist: true });
    if (errors.length) {
      const msg = errors
        .flatMap((e) => Object.values(e.constraints ?? {}))
        .join("; ");
      return next(new BadRequestError(`Validation errors found: ${msg}`));
    }

    (req as any)[part] = instance;
    next();
  };
}

export const validateBody = <T extends object>(dto: ClassConstructor<T>) =>
  makeValidator(dto, "body");
export const validateParams = <T extends object>(dto: ClassConstructor<T>) =>
  makeValidator(dto, "params");
export const validateQuery = <T extends object>(dto: ClassConstructor<T>) =>
  makeValidator(dto, "query");
