import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { TopicVersion } from "./topic-version.entity";

@Entity()
export class Topic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text")
  content: string;

  @Column({ default: 1 })
  version: number = 1;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  @ManyToOne(() => Topic, (topic) => topic.children)
  parentTopic: Topic;

  @OneToMany(() => Topic, (topic) => topic.parentTopic)
  children: Topic[];

  @OneToMany(() => TopicVersion, (topicVersion) => topicVersion.topic)
  topicVersions: TopicVersion[];
}
