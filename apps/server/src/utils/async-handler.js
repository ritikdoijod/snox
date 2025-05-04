export function asyncHandler(controller) {
  return async function (c, next) {
    try {
      return await controller(c, next);
    } catch (error) {
      throw error;
    }
  };
}
