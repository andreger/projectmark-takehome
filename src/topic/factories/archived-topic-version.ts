import { TopicHistory } from "../entities/topic-history.entity";
import { Topic } from "../entities/topic.entity";
import { TopicVersion } from "./topic-version.interface";
import { v4 as uuidv4 } from "uuid";

export class ArchivedTopicVersion implements TopicVersion<TopicHistory> {
  createTopicVersion(sourceTopic: Topic): TopicHistory {
    return {
      ...sourceTopic,
      id: uuidv4(),
      createdAt: sourceTopic.updatedAt,
      topic: sourceTopic,
    };
  }
}
