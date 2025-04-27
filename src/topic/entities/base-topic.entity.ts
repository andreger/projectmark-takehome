import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../shared/entities/base.entity";

@Entity()
export abstract class BaseTopic extends BaseEntity {
  @Column()
  name: string;

  @Column("text")
  content: string;

  @Column({ default: 1 })
  version: number;
}
