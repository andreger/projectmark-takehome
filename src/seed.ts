import "reflect-metadata";
import { randomInt } from "crypto";
import { AppDataSource } from "./shared/database";

import { UserService } from "./user/user.service";
import { TopicService } from "./topic/topic.service";
import { User, UserRole } from "./user/entities/user.entity";

async function seed() {
  const userService = new UserService();
  const topicService = new TopicService();

  /* ------------ users (run sequentially) ------------ */
  const demoUsers = [
    {
      name: "Alice",
      email: "alice@example.com",
      password: "alice123",
      role: UserRole.ADMIN,
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: "bob123",
      role: UserRole.EDITOR,
    },
    {
      name: "Carlos",
      email: "carlos@example.com",
      password: "carlos123",
      role: UserRole.VIEWER,
    },
  ];

  for (const u of demoUsers) {
    await userService.createUser(u);
  }

  const tsRoot = await topicService.createTopic({
    name: "TypeScript Basics",
    content: "Intro to TS",
  });

  const tsPrimitives = await topicService.createTopic({
    name: "Primitive Types",
    content: "string | number | boolean …",
    parentTopicId: tsRoot.id,
  });
  await topicService.createTopic({
    name: "Generics",
    content: "Using <T> properly",
    parentTopicId: tsRoot.id,
  });

  const tsInterfaces = await topicService.createTopic({
    name: "Interfaces",
    content: "Interfaces are like classes",
    parentTopicId: tsPrimitives.id,
  });
  await topicService.createTopic({
    name: "Classes",
    content: "Classes are like interfaces",
    parentTopicId: tsPrimitives.id,
  });

  await topicService.createTopic({
    name: "Functions",
    content: "Functions are like functions",
    parentTopicId: tsInterfaces.id,
  });

  console.log("✅ Seed complete!");
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
