import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column()
  role: string;

  @CreateDateColumn()
  createdAt: Date;
}
