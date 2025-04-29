import express from "express";
import authRoutes from "./auth/auth.routes";
import { buildContainer } from "./bootstrap";
import { createUserRouter } from "./user/user.routes";
import { authenticate } from "./shared/middleware/authenticate.middleware";
import { errorHandler } from "./shared/middleware/error-handler.middleware";
import { createTopicRouter } from "./topic/topic.routes";
import { createResourceRouter } from "./resource/resource.routes";

export const createApp = async () => {
  const { controllers } = await buildContainer();

  const app = express();

  app.use(express.json());

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/topics", authenticate, createTopicRouter(controllers.topic));
  app.use("/api/users", authenticate, createUserRouter(controllers.user));
  app.use(
    "/api/resources",
    authenticate,
    createResourceRouter(controllers.resource)
  );

  // Error handler
  app.use(errorHandler);

  return app;
};
