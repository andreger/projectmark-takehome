import bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { ConflictError, NotFoundError } from "../shared/errors";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Repository } from "typeorm";

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  /**
   * Creates a new user and saves it to the database.
   * @param dto An object that contains the user's information.
   * @returns The newly created user.
   */
  async createUser(dto: CreateUserDto): Promise<Omit<User, "password">> {
    await this.ensureEmailIsAvailable(dto.email);

    const hashedPassword = await this.hashPassword(dto.password);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
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

    if (!user) throw new NotFoundError("User not found");

    return user;
  }

  /**
   * Updates a user by ID.
   *
   * @param id The user's ID
   * @param dto An object that contains the user's updated information.
   * @returns The updated user, or null if not found
   */
  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundError("User not found");

    if (dto.email && dto.email !== user.email) {
      await this.ensureEmailIsAvailable(dto.email);
    }

    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }

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

    if (!user) throw new NotFoundError("User not found");

    await this.userRepository.delete(id);
  }

  /**
   * Verifies that the provided email address is not already in use.
   *
   * @param email The email address to check
   * @throws ConflictError if the email address is already in use
   */
  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("Email already in use");
    }
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
