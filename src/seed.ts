import "reflect-metadata";

import { AppDataSource } from "./shared/database";

import { UserService } from "./user/user.service";
import { TopicService } from "./topic/topic.service";
import { User, UserRole } from "./user/entities/user.entity";
import { Topic } from "./topic/entities/topic.entity";
import { TopicHistory } from "./topic/entities/topic-history.entity";
import { TopicFactory } from "./topic/factories/topic.factory";
import { TopicHistoryFactory } from "./topic/factories/topic-history.factory";

async function seed() {
  await AppDataSource.initialize();

  await seedUsers();
  await seedTopics();

  await AppDataSource.destroy();
}

const seedUsers = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const userService = new UserService(userRepository);

  const users = [
    {
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: UserRole.ADMIN,
    },
    {
      name: "Editor",
      email: "editor@example.com",
      password: "editor123",
      role: UserRole.EDITOR,
    },
    {
      name: "Viewer",
      email: "viewer@example.com",
      password: "viewer123",
      role: UserRole.VIEWER,
    },
  ];

  for (const user of users) {
    await userService.createUser(user);
  }
};

const seedTopics = async () => {
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

  const tsRoot = await topicService.createTopic({
    name: "TypeScript Basics",
    content: "Intro to TS",
  });

  const tsPrimitives = await topicService.createTopic({
    name: "Primitive Types",
    content: "string | number | boolean …",
    parentId: tsRoot.id,
  });
  await topicService.createTopic({
    name: "Generics",
    content: "Using <T> properly",
    parentId: tsRoot.id,
  });

  const tsInterfaces = await topicService.createTopic({
    name: "Interfaces",
    content: "Interfaces are like classes",
    parentId: tsPrimitives.id,
  });
  await topicService.createTopic({
    name: "Classes",
    content: "Classes are like interfaces",
    parentId: tsPrimitives.id,
  });

  await topicService.createTopic({
    name: "Functions",
    content: "Functions are like functions",
    parentId: tsInterfaces.id,
  });
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
