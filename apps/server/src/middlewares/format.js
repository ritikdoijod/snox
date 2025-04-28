import { ERROR_CODES } from "@/utils/app-error";
import { STATUS } from "@/utils/constants";

const format = ({ apiVersion }) => {
  return async (c, next) => {
    c.json.success = ({ statusCode = STATUS.HTTP.OK, data, meta }) => c.json({
      status: "success",
      data,
      meta: {
        apiVersion,
        ...meta
      },
    }, statusCode);

    c.json.error = ({
      status = STATUS.HTTP.INTERNAL_SERVER_ERROR,
      errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
      message,
      details,
    }) =>
      c.json({
        status: "error",
        error: {
          code: errorCode,
          message,
          details,
        },
        meta: {
          apiVersion,
        },
      }, status);

    await next();
  };
};

export { format };
