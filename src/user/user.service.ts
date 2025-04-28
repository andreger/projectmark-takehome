import { AppDataSource } from "../shared/database";
import bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { NotFoundError } from "../shared/errors";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Creates a new user and saves it to the database.
   * @param dto An object that contains the user's information.
   * @returns The newly created user.
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(dto.password);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  /**
   * Retrieves all users.
   *
   * @returns An array of users
   */
  async listUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Retrieves a user by ID.
   *
   * @param id The user's ID
   * @returns The user with the specified ID
   */
  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundError("Topic not found");

    return user;
  }

  /**
   * Updates a user by ID.
   *
   * @param id The user's ID
   * @param dto An object that contains the user's updated information.
   * @returns The updated user, or null if not found
   */
  async updateUser(id: string, dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundError("Topic not found");

    await this.userRepository.update(id, dto);

    return this.getUser(id);
  }

  /**
   * Deletes a user by ID.
   *
   * @param id The user's ID
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundError("Topic not found");

    await this.userRepository.delete(id);
  }

  /**
   * Hashes a password.
   *
   * @param password The password to hash
   * @returns The hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
