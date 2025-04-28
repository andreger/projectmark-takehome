import { PermissionStrategy } from "./permission.strategy.interface";

export class EditorPermissionStrategy implements PermissionStrategy {
  canViewTopic = () => true;
  canEditTopic = () => true;
  canDeleteTopic = () => false;
  canManageUsers = () => false;
  canManageResources = () => true;
}
