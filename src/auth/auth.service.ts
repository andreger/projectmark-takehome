import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../user/entities/user.entity";
import { AppDataSource } from "../shared/database";
import { TokenPayload } from "./dto/token-payload";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "role"],
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  generateToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
  }
}
