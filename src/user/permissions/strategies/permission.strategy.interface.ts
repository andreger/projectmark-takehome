export interface PermissionStrategy {
  canViewTopic(): boolean;
  canEditTopic(): boolean;
  canDeleteTopic(): boolean;
  canManageUsers(): boolean;
  canManageResources(): boolean;
}
