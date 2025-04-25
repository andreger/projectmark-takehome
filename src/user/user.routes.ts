import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const controller = new UserController();

router.post("/", controller.createUser.bind(controller));
router.get("/", controller.getUsers.bind(controller));
// router.get("/:id", controller.findOne.bind(controller));
// router.patch("/:id", controller.update.bind(controller));
// router.delete("/:id", controller.delete.bind(controller));

export default router;
