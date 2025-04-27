import { AppDataSource } from "../shared/database";
import bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(dto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(dto.password, saltRounds);

    const user = this.userRepository.create({
      ...dto,
      password: hashed,
    });

    return this.userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // async getUserById(id: string): Promise<User | null> {
  //   return this.userRepository.findOneBy({ id });
  // }

  // async updateUser(id: string, dto: UpdateUserDto): Promise<User | null> {
  //   await this.userRepository.update(id, dto);
  //   return this.getUserById(id);
  // }

  // async deleteUser(id: string): Promise<void> {
  //   await this.userRepository.delete(id);
  // }
}
