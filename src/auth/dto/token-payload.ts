import { UserRole } from "../../user/entities/user.entity";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}
