import { IsString, Length, IsNotEmpty, IsEmail, IsIn } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { validation } from "../../config/validation";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
  @IsString()
  @Length(validation.user.name.min, validation.user.name.max)
  @Trim()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Trim()
  email: string;

  @IsString()
  @Length(validation.user.password.min, validation.user.password.max)
  @Trim()
  password: string;

  @IsNotEmpty()
  @IsIn([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER])
  role: string;
}
