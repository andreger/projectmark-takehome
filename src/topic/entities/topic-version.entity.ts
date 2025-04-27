import { Entity, ManyToOne } from "typeorm";
import { Topic } from "./topic.entity";
import { BaseTopic } from "./base-topic.entity";

@Entity()
export class TopicVersion extends BaseTopic {
  @ManyToOne(() => Topic, (topic) => topic.children)
  topic: Topic;
}
