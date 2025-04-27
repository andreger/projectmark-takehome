import { Entity, Column, ManyToOne, OneToMany, VersionColumn } from "typeorm";
import { VersionableEntity } from "../../shared/entities/versionable.entity";

@Entity()
export class Topic extends VersionableEntity {
  @Column()
  name: string;

  @Column("text")
  content: string;

  @ManyToOne(() => Topic, (topic) => topic.children)
  parentTopic: Topic;

  @OneToMany(() => Topic, (topic) => topic.parentTopic)
  children: Topic[];
}
