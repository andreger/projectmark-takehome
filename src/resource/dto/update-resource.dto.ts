import {
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsIn,
  IsInt,
  IsUrl,
  IsOptional,
} from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { validation } from "../../config/validation";
import { ResourceType } from "../entities/resource.entity";

export class UpdateResourceDto {
  @IsOptional()
  @IsUrl()
  @Length(validation.resource.url.min, validation.resource.url.max)
  @Trim()
  url: string;

  @IsOptional()
  @IsString()
  @Length(
    validation.resource.description.min,
    validation.resource.description.max
  )
  @Trim()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn([ResourceType.VIDEO, ResourceType.ARTICLE, ResourceType.PDF])
  type: string;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  topicId: number;
}
