import { DataSource } from "typeorm";
import path from "path";
import { Topic } from "../../topic/entities/topic.entity";
import { TopicHistory } from "../../topic/entities/topic-history.entity";
import { User } from "../../user/entities/user.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  // database: ":memory:",
  database: path.join(__dirname, "../../../database.sqlite"),
  synchronize: true,
  logging: true,
  entities: [Topic, TopicHistory, User],
});

// AppDataSource.initialize()
//   .then(() => console.log("Database connected!"))
//   .catch((err) => console.error("Database error:", err));
