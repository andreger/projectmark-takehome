import { IsUUID } from "class-validator";

export class IDTopicDto {
  @IsUUID()
  id: string;
}
