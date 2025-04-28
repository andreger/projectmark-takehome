import { IsUUID } from "class-validator";

export class OnlyIDDto {
  @IsUUID()
  id: string;
}
