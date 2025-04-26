import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

export class UserController {
  private userService = new UserService();

  async createUser(req: Request, res: Response) {
    try {
      const dto: CreateUserDto = req.body;
      const user = await this.userService.createUser(dto);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Failed to create user" });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
}
