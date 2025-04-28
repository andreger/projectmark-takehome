import { Transform } from "class-transformer";
import { IsString, IsOptional, IsUUID, Length } from "class-validator";

export class UpdateTopicDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @Length(10, 5000)
  @Transform(({ value }) => value?.trim())
  content: string;

  @IsOptional()
  @IsUUID()
  parentTopicId?: string;
}
