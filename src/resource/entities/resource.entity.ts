import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../shared/entities/base.entity";
import { Topic } from "../../topic/entities/topic.entity";

export enum ResourceType {
  VIDEO = "video",
  ARTICLE = "article",
  PDF = "pdf",
}

@Entity()
export class Resource extends BaseEntity {
  @Column()
  url: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @ManyToOne(() => Topic, (topic) => topic.resources, {
    onDelete: "CASCADE",
  })
  topic: Topic;
}
