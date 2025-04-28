import { Request, Response, NextFunction } from "express";
import { PermissionContext } from "../../user/permissions/permission-context";
import { TokenPayload } from "../../auth/dto/token-payload";
import { ForbiddenError, UnauthorizedError } from "../errors";

export function authorize(action: keyof PermissionContext) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as TokenPayload;

    if (!user) {
      next(new UnauthorizedError("You must be logged in"));
      return;
    }

    const context = new PermissionContext(user);
    const allowed = (context[action] as () => boolean).call(context);

    if (!allowed) {
      next(new ForbiddenError("You are not allowed to perform this action"));
      return;
    }

    next();
  };
}
