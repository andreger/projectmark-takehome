import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const router = Router();
const authService = new AuthService();
const controller = new AuthController(authService);

router.post("/login", controller.login.bind(controller));

export default router;
