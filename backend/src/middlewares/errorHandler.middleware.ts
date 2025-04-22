import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  console.log(`Error occurred on path ${req.path}`, error);

  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: `Invalid JSON format... check your json data provided`,
    });
  }

  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ message: error.message, errorCode: error.errorCode });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server error occured",
    error: error?.message || `Unknown error occurred`,
  });
};
