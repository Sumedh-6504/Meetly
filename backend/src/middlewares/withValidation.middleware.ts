import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./asyncHandler.middleware";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { HTTPSTATUS } from "../config/http.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";

type ValidationSource = "body" | "params" | "query";

export function asyncHandlerAndValidation<T extends object>(
  dto: new () => T,
  source: ValidationSource = "body",
  handler: (req: Request, res: Response, dto: T) => Promise<any>
) {
  return asyncHandler(withValidation(dto, source)(handler));
}

export function withValidation<T extends object>(
  DtoClass: new () => T,
  source: ValidationSource = "body"
) {
  return function (
    handler: (req: Request, res: Response, dto: T) => Promise<any>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dtoInstance = await plainToInstance(DtoClass, req[source]);

        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
          return formatValidationErrors(res, errors);
        }

        return handler(req, res, dtoInstance);
      } catch (error) {
        next(error);
      }
    };
  };
}

export function formatValidationErrors(
  res: Response,
  errors: ValidationError[]
) {
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation Failed",
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    errors: errors.map((err) => ({
      field: err.property,
      message: err.constraints,
    })),
  });
}
