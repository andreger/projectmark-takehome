import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../../auth/dto/token-payload";
import { ForbiddenError, UnauthorizedError } from "../errors";
import { UserRole } from "../../user/entities/user.entity";
import { AdminPermissionStrategy } from "../../user/permissions/strategies/admin-permission.strategy";
import { EditorPermissionStrategy } from "../../user/permissions/strategies/editor-permission.strategy";
import { ViewerPermissionStrategy } from "../../user/permissions/strategies/viewer-permission.strategy";
import { PermissionStrategy } from "../../user/permissions/strategies/permission.strategy.interface";

export function authorize(action: keyof PermissionStrategy) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as TokenPayload;

    if (!user) {
      next(new UnauthorizedError("You must be logged in"));
      return;
    }

    const strategy = getPermissionStrategy(user.role);
    const allowed = (strategy[action] as () => boolean).call(strategy);

    if (!allowed) {
      next(new ForbiddenError("You are not allowed to perform this action"));
      return;
    }

    next();
  };
}

function getPermissionStrategy(userRole: UserRole): PermissionStrategy {
  switch (userRole) {
    case UserRole.ADMIN:
      return new AdminPermissionStrategy();
    case UserRole.EDITOR:
      return new EditorPermissionStrategy();
    case UserRole.VIEWER:
      return new ViewerPermissionStrategy();
  }
}
