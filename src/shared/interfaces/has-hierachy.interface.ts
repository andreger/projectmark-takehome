export interface HasHierarchy<T> {
  parent: T | null;
  children: T[];
}
