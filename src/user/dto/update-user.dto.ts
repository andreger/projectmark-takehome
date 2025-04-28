import {
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsIn,
  IsOptional,
} from "class-validator";
import { Trim } from "../../shared/database/trim.decorator";
import { validation } from "../../config/validation";
import { UserRole } from "../entities/user.entity";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(validation.user.name.min, validation.user.name.max)
  @Trim()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Trim()
  email: string;

  @IsOptional()
  @IsString()
  @Length(validation.user.password.min, validation.user.password.max)
  @Trim()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER])
  role: string;
}
