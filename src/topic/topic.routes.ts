import { Router } from "express";
import { TopicController } from "./topic.controller";

const router = Router();
const controller = new TopicController();

router.get("/", controller.listTopics.bind(controller));
router.post("/", controller.createTopic.bind(controller));
router.get("/:id", controller.getTopic.bind(controller));
router.patch("/:id", controller.updateTopic.bind(controller));
router.delete("/:id", controller.deleteTopic.bind(controller));
router.get("/:id/tree", controller.getTopicTree.bind(controller));

export default router;
