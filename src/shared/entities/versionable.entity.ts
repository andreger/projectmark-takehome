import { VersionColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

export abstract class VersionableEntity extends BaseEntity {
  @VersionColumn()
  version: number;
}
