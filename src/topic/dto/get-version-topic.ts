import { Transform } from "class-transformer";
import { IsInt, IsUUID } from "class-validator";

export class GetVersionTopicDto {
  @IsUUID()
  id: string;

  @IsInt()
  @Transform(({ value }) => Number(value))
  version: number;
}
