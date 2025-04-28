import { IsUUID } from "class-validator";

export class ShortestPathDto {
  @IsUUID()
  fromId: string;

  @IsUUID()
  toId: string;
}
