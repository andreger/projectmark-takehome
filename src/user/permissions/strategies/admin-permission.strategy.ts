import { PermissionStrategy } from "./permission.strategy.interface";

export class AdminPermissionStrategy implements PermissionStrategy {
  canViewTopic = () => true;
  canEditTopic = () => true;
  canDeleteTopic = () => true;
  canManageUsers = () => true;
  canManageResources = () => true;
}
