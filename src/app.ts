import express from "express";
import authRoutes from "./auth/auth.routes";
import topicRoutes from "./topic/topic.routes";
import userRoutes from "./user/user.routes";
import { authenticate } from "./shared/middleware/authenticate.middleware";
import { errorHandler } from "./shared/middleware/error-handler.middleware";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/topics", topicRoutes);
  app.use("/api/users", userRoutes);

  // Protected route
  app.get("/api/protected", authenticate, (req, res) => {
    res.json({ message: `Hello ${req.user?.email}!` });
  });

  app.use(errorHandler);

  return app;
};
