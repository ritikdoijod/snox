import { ZodError } from "zod";
import { AppError, ERROR_CODES } from "@/utils/app-error.js";
import { STATUS } from "@/utils/constants.js"

const validate = ({ params, headers, body }) => {
  return (req, res, next) => {
    try {
      if (params) req.params = params.parse(req.params);

      if (headers) req.headers = headers.parse(req.headers);

      if (body) req.body = body.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(
          STATUS.HTTP.BAD_REQUEST,
          ERROR_CODES.VALIDATION_ERROR,
          "Validation error occurred",
          error?.issues?.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        );
      }
    }
  };
};

export { validate };
