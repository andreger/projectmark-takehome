import { DataSource } from "typeorm";
import path from "path";
import { Topic } from "../../topic/entities/topic.entity";
import { TopicHistory } from "../../topic/entities/topic-history.entity";
import { User } from "../../user/entities/user.entity";
import { Resource } from "../../resource/entities/resource.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  // database: ":memory:",
  database: path.join(__dirname, "../../../database.sqlite"),
  synchronize: true,
  logging: true,
  entities: [Resource, Topic, TopicHistory, User],
});
