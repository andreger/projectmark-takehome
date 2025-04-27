import { Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseTopic } from "./base-topic.entity";

@Entity()
export class Topic extends BaseTopic {
  @ManyToOne(() => Topic, (topic) => topic.children)
  parentTopic: Topic;

  @OneToMany(() => Topic, (topic) => topic.parentTopic)
  children: Topic[];
}
