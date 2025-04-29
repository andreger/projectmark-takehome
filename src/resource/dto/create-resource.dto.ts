import {
  IsString,
  Length,
  IsNotEmpty,
  IsIn,
  IsUrl,
  IsUUID,
} from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { validation } from "../../config/validation";
import { ResourceType } from "../entities/resource.entity";

export class CreateResourceDto {
  @IsUrl()
  @Length(validation.resource.url.min, validation.resource.url.max)
  @Trim()
  url: string;

  @IsString()
  @Length(
    validation.resource.description.min,
    validation.resource.description.max
  )
  @Trim()
  description: string;

  @IsNotEmpty()
  @IsIn([ResourceType.VIDEO, ResourceType.ARTICLE, ResourceType.PDF])
  type: string;

  @IsNotEmpty()
  @IsUUID()
  topicId: string;
}
