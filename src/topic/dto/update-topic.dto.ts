import { IsString, IsOptional, IsUUID, Length } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { validation } from "../../config/validation";

export class UpdateTopicDto {
  @IsOptional()
  @IsString()
  @Length(validation.topic.name.min, validation.topic.name.max)
  @Trim()
  name: string;

  @IsOptional()
  @IsString()
  @Length(validation.topic.content.min, validation.topic.content.max)
  @Trim()
  content: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
