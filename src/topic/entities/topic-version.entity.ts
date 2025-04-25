import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Topic } from "./topic.entity";

@Entity()
export class TopicVersion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text")
  content: string;

  @Column()
  version: number;

  @Column({ type: "datetime" })
  createdAt: Date;

  @ManyToOne(() => Topic, (topic) => topic.children)
  topic: Topic;
}
