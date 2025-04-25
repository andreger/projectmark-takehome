import { DataSource } from "typeorm";
import path from "path";
import { Topic } from "../../topic/entities/topic.entity";
import { TopicVersion } from "../../topic/entities/topic-version.entity";
import { User } from "../../user/entities/user.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  // database: ":memory:",
  database: path.join(__dirname, "../../../database.sqlite"),
  synchronize: true,
  logging: true,
  entities: [Topic, TopicVersion, User],
});

AppDataSource.initialize()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database error:", err));
