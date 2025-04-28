import { CreateTopicDto } from "../dto/create-topic.dto";
import { UpdateTopicDto } from "../dto/update-topic.dto";
import { Topic } from "../entities/topic.entity";

export class TopicFactory {
  create(newContent: CreateTopicDto | UpdateTopicDto, source?: Topic): Topic {
    const topic = source ?? new Topic();

    topic.name = newContent.name ?? topic.name;
    topic.content = newContent.content ?? topic.content;
    topic.version = topic.version ? topic.version + 1 : 1;

    return topic;
  }
}
