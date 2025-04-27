import { Topic } from "../entities/topic.entity";

export interface TopicVersion<T> {
  createTopicVersion(sourceTopic: Topic): T;
}
