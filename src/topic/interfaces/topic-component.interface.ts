export interface TopicComponent {
  add(child: TopicComponent): void;
  remove(childId: string): void;
  find(childId: string): TopicComponent | undefined;
}
