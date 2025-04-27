import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { TopicVersion } from "./topic-version.entity";
import { BaseEntity } from "../../shared/entities/base.entity";

@Entity()
export class Topic extends BaseEntity {
  @Column()
  name: string;

  @Column("text")
  content: string;

  @Column({ default: 1 })
  version: number;

  @ManyToOne(() => Topic, (topic) => topic.children)
  parentTopic: Topic;

  @OneToMany(() => Topic, (topic) => topic.parentTopic)
  children: Topic[];

  @OneToMany(() => TopicVersion, (topicVersion) => topicVersion.topic)
  topicVersions: TopicVersion[];
}
