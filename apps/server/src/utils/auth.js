import { ForbiddenException } from "@/utils/app-error";

export function authz(policy) {
  return async function (...args) {
    if (await policy(...args)) return;
    throw new ForbiddenException("Access denied");
  };
}
