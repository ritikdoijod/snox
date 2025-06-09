export function asyncHandler(fn) {
  return async function (...args) {
    try {
      return await fn(...args);
    } catch (error) {
      console.log(error);
      return { error };
    }
  };
}
