import { Router } from "express";
import { TopicController } from "./topic.controller";
import { validateBody } from "../shared/middleware/validation.middleware";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { authorize } from "../shared/middleware/authorize.middleware";

const router = Router();
const controller = new TopicController();

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
  authorize("canViewTopic"),
  controller.getTopic.bind(controller)
);
router.patch(
  "/:id",
  authorize("canEditTopic"),
  controller.updateTopic.bind(controller)
);
router.delete(
  "/:id",
  authorize("canDeleteTopic"),
  controller.deleteTopic.bind(controller)
);
router.get(
  "/:id/tree",
  authorize("canViewTopic"),
  controller.getTopicTree.bind(controller)
);

export default router;
