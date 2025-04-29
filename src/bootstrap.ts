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
import { ResourceController } from "./resource/resource.controller";
import { ResourceService } from "./resource/resource.service";
import { Resource } from "./resource/entities/resource.entity";
import { User } from "./user/entities/user.entity";

export async function buildContainer() {
  AppDataSource.initialize()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.error("Database error:", err));

  // Repositories
  const resourceRepository = AppDataSource.getRepository(Resource);
  const topicRepository = AppDataSource.getTreeRepository(Topic);
  const topicHistoryRepository = AppDataSource.getRepository(TopicHistory);
  const userRepository = AppDataSource.getRepository(User);

  // Factories
  const topicFactory: TopicFactory = new TopicFactory();
  const topicHistoryFactory: TopicHistoryFactory = new TopicHistoryFactory();

  // Services
  const topicService = new TopicService(
    topicRepository,
    topicHistoryRepository,
    topicFactory,
    topicHistoryFactory
  );
  const resourceService = new ResourceService(resourceRepository);
  const userService = new UserService(userRepository);

  // Controllers
  const resourceController = new ResourceController(resourceService);
  const topicController = new TopicController(topicService);
  const userController = new UserController(userService);

  return {
    controllers: {
      resource: resourceController,
      topic: topicController,
      user: userController,
    },
    services: {
      resource: resourceService,
      topic: topicService,
      user: userService,
    },
  };
}
