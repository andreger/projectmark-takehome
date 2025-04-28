import { PermissionStrategy } from "./permission.strategy.interface";

export class ViewerPermissionStrategy implements PermissionStrategy {
  canViewTopic = () => true;
  canEditTopic = () => false;
  canDeleteTopic = () => false;
}
