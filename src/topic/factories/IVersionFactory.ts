import { Topic } from "../entities/topic.entity";

export interface IVersionFactory {
  createVersion(sourceTopic: Topic, newContent: string): Topic;
}
