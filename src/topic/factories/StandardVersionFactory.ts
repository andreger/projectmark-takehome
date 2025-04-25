import { Topic } from "../entities/topic.entity";
import { IVersionFactory } from "./IVersionFactory";

export class StandardVersionFactory implements IVersionFactory {
  createVersion(sourceTopic: Topic, newContent: string): Topic {
    const newVersion = new Topic();
    newVersion.name = sourceTopic.name;
    newVersion.content = newContent;
    newVersion.version = sourceTopic.version + 1;
    newVersion.parentTopic = sourceTopic.parentTopic;
    return newVersion;
  }
}
