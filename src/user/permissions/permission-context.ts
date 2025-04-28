import { AdminPermissionStrategy } from "./strategies/admin-permission.strategy";
import { EditorPermissionStrategy } from "./strategies/editor-permission.strategy";
import { PermissionStrategy } from "./strategies/permission.strategy.interface";
import { UserRole } from "../entities/user.entity";
import { TokenPayload } from "../../auth/dto/token-payload";
import { ViewerPermissionStrategy } from "./strategies/viewer-permission.strategy";
import { BadRequestError, ForbiddenError } from "../../shared/errors";

export class PermissionContext implements PermissionStrategy {
  private strategy: PermissionStrategy;

  constructor(user: TokenPayload) {
    switch (user.role) {
      case UserRole.ADMIN:
        this.strategy = new AdminPermissionStrategy();
        break;
      case UserRole.EDITOR:
        this.strategy = new EditorPermissionStrategy();
        break;
      case UserRole.VIEWER:
        this.strategy = new ViewerPermissionStrategy();
        break;
      default:
        new BadRequestError("Invalid user role");
    }
  }

  canEditTopic(): boolean {
    return this.strategy.canEditTopic();
  }

  canDeleteTopic(): boolean {
    return this.strategy.canDeleteTopic();
  }

  canViewTopic(): boolean {
    return this.strategy.canViewTopic();
  }
}
