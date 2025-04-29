import { Entity, OneToMany, Tree, TreeChildren, TreeParent } from "typeorm";
import { BaseTopic } from "./base-topic.entity";
import { TopicComponent } from "../interfaces/topic-component.interface";
import { TopicHistory } from "./topic-history.entity";
import { HasHierarchy } from "../../shared/interfaces/has-hierachy.interface";
import { HasHistory } from "../../shared/interfaces/has-history.interface";
import { Resource } from "../../resource/entities/resource.entity";

@Entity()
@Tree("closure-table")
export class Topic
  extends BaseTopic
  implements TopicComponent, HasHierarchy<Topic>, HasHistory<TopicHistory>
{
  @TreeParent({
    onDelete: "CASCADE",
  })
  parent: Topic;

  @TreeChildren({ cascade: true })
  children: Topic[];

  @OneToMany(() => TopicHistory, (history) => history.topic, {
    cascade: true,
  })
  histories: TopicHistory[];

  @OneToMany(() => Resource, (resource) => resource.topic, {
    cascade: true,
  })
  resources: Resource[];

  add(child: Topic) {
    child.parent = this;
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
