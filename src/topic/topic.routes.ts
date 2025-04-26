import { Router } from "express";
import { TopicController } from "./topic.controller";
import { validateBody } from "../shared/middleware/validation.middleware";
import { CreateTopicDto } from "./dto/create-topic.dto";

const router = Router();
const controller = new TopicController();

router.get("/", controller.listTopics.bind(controller));
router.post(
  "/",
  validateBody(CreateTopicDto),
  controller.createTopic.bind(controller)
);
router.get("/:id", controller.getTopic.bind(controller));
router.patch("/:id", controller.updateTopic.bind(controller));
router.delete("/:id", controller.deleteTopic.bind(controller));
router.get("/:id/tree", controller.getTopicTree.bind(controller));

export default router;
