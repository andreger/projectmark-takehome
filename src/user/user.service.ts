import { AppDataSource } from "../shared/database";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
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
