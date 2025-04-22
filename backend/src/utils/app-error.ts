import { HTTPSTATUS, httpStatusCodeType } from "../config/http.config";
import { ErroCodeEnumType, ErrorCodeEnum } from "../enums/error-code.enum";
export class AppError extends Error {
  public statusCode: httpStatusCodeType;
  public errorCode?: ErroCodeEnumType;

  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErroCodeEnumType
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpException extends AppError {
  constructor(message = "HTTP_Error", errorCode?: ErroCodeEnumType) {
    super(message, HTTPSTATUS.SERVICE_UNAVAILABLE),
      errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND;
  }
}

export class InternalServerException extends AppError {
  constructor(message = "Internal Server Error", errorCode?: ErroCodeEnumType) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
    );
  }
}

export class NotFoundException extends AppError {
  constructor(message = "Resource not found", errorCode?: ErroCodeEnumType) {
    super(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
    );
  }
}

export class BadRequestException extends AppError {
  constructor(message = "Bad Request", errorCode?: ErroCodeEnumType) {
    super(
      message,
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCodeEnum.VALIDATION_ERROR
    );
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized Access", errorCode?: ErroCodeEnumType) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
}
