import { Transform } from "class-transformer";
import { IsString, IsOptional, IsUUID, Length } from "class-validator";

export class CreateTopicDto {
  @IsString()
  @Length(3, 100)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @Length(10, 5000)
  @Transform(({ value }) => value?.trim())
  content: string;

  @IsOptional()
  @IsUUID()
  parentTopicId?: string;
}
