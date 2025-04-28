import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { NotFoundError } from "../shared/errors";

export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Retrieves all users.
   *
   * Retrieves all users from the database and responds with their data in JSON format.
   *
   * @param req The request containing no parameters
   * @param res The response containing the list of users
   */
  async listUsers(req: Request, res: Response) {
    const users = await this.userService.listUsers();
    res.json(users);
  }

  /**
   * Retrieves a user by ID.
   *
   * Extracts the user ID from the request parameters and retrieves the corresponding user.
   * If the user is not found, passes a NotFoundError to the next middleware.
   * Otherwise, responds with the user data in JSON format.
   *
   * @param req The request containing the user ID
   * @param res The response containing the user data
   * @param next The next function in the middleware chain
   */

  async getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await this.userService.getUser(id);

    if (!user) return next(new NotFoundError("User not found"));

    res.json(user);
  }

  /**
   * Creates a new user.
   *
   * Retrieves the user data from the request body and creates a new user in the database.
   * Responds with the newly created user data in JSON format and a 201 status code.
   *
   * @param req The request containing the user data
   * @param res The response containing the newly created user
   */
  async createUser(req: Request, res: Response) {
    const dto: CreateUserDto = req.body;
    const user = await this.userService.createUser(dto);
    res.status(201).json(user);
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const dto: CreateUserDto = req.body;
    const user = await this.userService.updateUser(id, dto);
    res.json(user);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    await this.userService.deleteUser(id);
    res.status(204).send();
  }
}
