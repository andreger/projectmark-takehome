import { UpdateTopicDto } from "../dto/update-topic.dto";
import { Topic } from "../entities/topic.entity";
import { TopicVersion } from "./topic-version.interface";

export class CurrentTopicVersion implements TopicVersion<Topic> {
  createTopicVersion(sourceTopic: Topic): Topic {
    return {
      ...sourceTopic,
      version: sourceTopic.version ? sourceTopic.version + 1 : 1,
    };
  }
}
