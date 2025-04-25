import { Topic } from "../../topic/entities/topic.entity";
import { AdminPermissionStrategy } from "./strategies/AdminPermissionStrategy";
import { EditorPermissionStrategy } from "./strategies/EditorPermissionStrategy";
import { IPermissionStrategy } from "./interfaces/IPermissionStrategy";
import { User } from "../entities/user.entity";

export class PermissionContext {
  private strategy: IPermissionStrategy;

  constructor(user: User) {
    // this.strategy =
    //   user.role === UserRole.ADMIN
    //     ? new AdminPermissionStrategy()
    //     : new EditorPermissionStrategy();

    this.strategy = new AdminPermissionStrategy();
  }

  canEditTopic(user: User, topic: Topic): boolean {
    return this.strategy.canEditTopic(user, topic);
  }
}
