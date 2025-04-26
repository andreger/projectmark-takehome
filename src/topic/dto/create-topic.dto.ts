import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from "class-validator";

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 5000)
  content: string;

  @IsOptional()
  @IsUUID()
  parentTopicId?: string;
}
