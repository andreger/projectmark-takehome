import { Router } from "express";
import { TopicController } from "./topic.controller";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { authorize } from "../shared/middleware/authorize.middleware";
import {
  validateBody,
  validateParams,
} from "../shared/middleware/validate.middleware";
import { GetVersionTopicDto } from "./dto/get-version-topic";
import { ShortestPathDto } from "./dto/shortest-path.dto";
import { OnlyIDDto } from "../shared/dto/only-id.dto";

export function createTopicRouter(controller: TopicController): Router {
  const router = Router();

  router.get(
    "/",
    authorize("canViewTopic"),
    controller.listTopics.bind(controller)
  );

  router.post(
    "/",
    [authorize("canEditTopic"), validateBody(CreateTopicDto)],
    controller.createTopic.bind(controller)
  );

  router.get(
    "/:id",
    [authorize("canViewTopic"), validateParams(OnlyIDDto)],
    controller.getTopic.bind(controller)
  );

  router.get(
    "/:id/version/:version",
    [authorize("canViewTopic"), validateParams(GetVersionTopicDto)],
    controller.getTopicHistory.bind(controller)
  );

  router.patch(
    "/:id",
    [authorize("canEditTopic"), validateBody(UpdateTopicDto)],
    controller.updateTopic.bind(controller)
  );

  router.delete(
    "/:id",
    [authorize("canDeleteTopic"), validateParams(OnlyIDDto)],
    controller.deleteTopic.bind(controller)
  );

  router.get(
    "/:id/tree",
    [authorize("canViewTopic"), validateParams(OnlyIDDto)],
    controller.getTopicTree.bind(controller)
  );

  router.get(
    "/:fromId/path/:toId",
    [authorize("canViewTopic"), validateParams(ShortestPathDto)],
    controller.getShortestPath.bind(controller)
  );

  return router;
}
