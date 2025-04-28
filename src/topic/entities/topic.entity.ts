import {
  Entity,
  ManyToOne,
  OneToMany,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { BaseTopic } from "./base-topic.entity";
import { TopicComponent } from "../interfaces/topic-component.interface";

@Entity()
export class Topic extends BaseTopic implements TopicComponent {
  @TreeParent()
  parentTopic: Topic;

  @TreeChildren({ cascade: true })
  children: Topic[];

  add(child: Topic) {
    child.parentTopic = this;
    (this.children ??= []).push(child);
  }

  remove(childId: string) {
    if (!this.children) return;
    this.children = this.children.filter((child) => child.id !== childId);
  }

  find(childId: string): Topic | undefined {
    if (this.id === childId) return this;
    for (const child of this.children ?? []) {
      const found = child.find(childId);
      if (found) return found;
    }
  }
}
