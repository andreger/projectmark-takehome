import "reflect-metadata";
import { AppDataSource } from "./shared/database";

import { TopicService } from "./topic/topic.service";
import { TopicController } from "./topic/topic.controller";
import { Topic } from "./topic/entities/topic.entity";
import { TopicFactory } from "./topic/factories/topic.factory";
import { TopicHistoryFactory } from "./topic/factories/topic-history.factory";
import { TopicHistory } from "./topic/entities/topic-history.entity";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";

export async function buildContainer() {
  AppDataSource.initialize()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.error("Database error:", err));

  const topicRepository = AppDataSource.getTreeRepository(Topic);
  const topicHistoryRepository = AppDataSource.getRepository(TopicHistory);

  const topicFactory: TopicFactory = new TopicFactory();
  const topicHistoryFactory: TopicHistoryFactory = new TopicHistoryFactory();

  const topicService = new TopicService(
    topicRepository,
    topicHistoryRepository,
    topicFactory,
    topicHistoryFactory
  );
  const userService = new UserService();

  const topicController = new TopicController(topicService);
  const userController = new UserController(userService);

  return {
    controllers: {
      topic: topicController,
      user: userController,
    },
    services: {
      topic: topicService,
      user: userService,
    },
  };
}
