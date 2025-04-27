import { Entity, Column, ManyToOne } from "typeorm";
import { Topic } from "./topic.entity";
import { BaseEntity } from "../../shared/entities/base.entity";

@Entity()
export class TopicVersion extends BaseEntity {
  @Column()
  name: string;

  @Column("text")
  content: string;

  @Column()
  version: number;

  @ManyToOne(() => Topic, (topic) => topic.children)
  topic: Topic;
}
