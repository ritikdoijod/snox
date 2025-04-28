import { HTTPException } from 'hono/http-exception';
import { STATUS } from "@/utils/constants.js"

export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
};

export class AppError extends HTTPException {
  constructor(statusCode, errorCode, message, details) {
    super(statusCode, { message });
    this.errorCode = errorCode;
    this.details = details;
  }
}

export class InternalServerException extends AppError {
  constructor(message, details) {
    super(
      STATUS.HTTP.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      message,
      details,
    );
  }
}

export class BadRequestException extends AppError {
  constructor(message, details) {
    super(STATUS.HTTP.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, message, details);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message, details) {
    super(STATUS.HTTP.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, message, details);
  }
}

export class ForbiddenException extends AppError {
  constructor(message, details) {
    super(STATUS.HTTP.FORBIDDEN, ERROR_CODES.FORBIDDEN, message, details);
  }
}

export class NotFoundException extends AppError {
  constructor(message, details) {
    super(STATUS.HTTP.NOT_FOUND, ERROR_CODES.NOT_FOUND, message, details);
  }
}
