import { Router } from "express";
import { UserController } from "./user.controller";

export function createUserRouter(controller: UserController): Router {
  const router = Router();

  router.post("/", controller.createUser.bind(controller));
  router.get("/", controller.listUsers.bind(controller));
  // router.get("/:id", controller.findOne.bind(controller));
  // router.patch("/:id", controller.update.bind(controller));
  // router.delete("/:id", controller.delete.bind(controller));

  return router;
}
