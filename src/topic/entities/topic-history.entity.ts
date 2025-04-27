import { Entity, ManyToOne } from "typeorm";
import { Topic } from "./topic.entity";
import { BaseTopic } from "./base-topic.entity";

@Entity()
export class TopicHistory extends BaseTopic {
  @ManyToOne(() => Topic, (topic) => topic.children)
  topic: Topic;
}
