import { Router } from "express";
import { UserController } from "./user.controller";
import { authorize } from "../shared/middleware/authorize.middleware";
import {
  validateBody,
  validateParams,
} from "../shared/middleware/validate.middleware";
import { CreateUserDto } from "./dto/create-user.dto";
import { OnlyIDDto } from "../shared/dto/only-id.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

export function createUserRouter(controller: UserController): Router {
  const router = Router();

  router.get(
    "/",
    authorize("canManageUsers"),
    controller.listUsers.bind(controller)
  );

  router.post(
    "/",
    [authorize("canManageUsers"), validateBody(CreateUserDto)],
    controller.createUser.bind(controller)
  );

  router.get(
    "/:id",
    [authorize("canManageUsers"), validateParams(OnlyIDDto)],
    controller.getUser.bind(controller)
  );

  router.patch(
    "/:id",
    [authorize("canManageUsers"), validateBody(UpdateUserDto)],
    controller.updateUser.bind(controller)
  );

  router.delete(
    "/:id",
    [authorize("canManageUsers"), validateParams(OnlyIDDto)],
    controller.deleteUser.bind(controller)
  );

  return router;
}
