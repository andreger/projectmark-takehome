import { Router } from "express";
import { ResourceController } from "./resource.controller";
import { authorize } from "../shared/middleware/authorize.middleware";
import {
  validateBody,
  validateParams,
} from "../shared/middleware/validate.middleware";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { OnlyIDDto } from "../shared/dto/only-id.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";

export function createResourceRouter(controller: ResourceController): Router {
  const router = Router();

  router.get(
    "/",
    authorize("canManageResources"),
    controller.listResources.bind(controller)
  );

  router.post(
    "/",
    [authorize("canManageResources"), validateBody(CreateResourceDto)],
    controller.createResource.bind(controller)
  );

  router.get(
    "/:id",
    [authorize("canManageResources"), validateParams(OnlyIDDto)],
    controller.getResource.bind(controller)
  );

  router.patch(
    "/:id",
    [authorize("canManageResources"), validateBody(UpdateResourceDto)],
    controller.updateResource.bind(controller)
  );

  router.delete(
    "/:id",
    [authorize("canManageResources"), validateParams(OnlyIDDto)],
    controller.deleteResource.bind(controller)
  );

  return router;
}
