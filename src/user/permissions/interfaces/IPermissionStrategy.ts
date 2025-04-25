import { User } from "../../entities/user.entity";
import { Topic } from "../../../topic/entities/topic.entity";

export interface IPermissionStrategy {
  canEditTopic(user: User, topic: Topic): boolean;
  canDeleteTopic(user: User, topic: Topic): boolean;
}
