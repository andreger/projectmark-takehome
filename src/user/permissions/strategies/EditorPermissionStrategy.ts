import { IPermissionStrategy } from "../interfaces/IPermissionStrategy";
import { User } from "../../entities/user.entity";
import { Topic } from "../../../topic/entities/topic.entity";

export class EditorPermissionStrategy implements IPermissionStrategy {
  canEditTopic = (_user: User, _topic: Topic) => true;
  canDeleteTopic = (_user: User, _topic: Topic) => false;
}
