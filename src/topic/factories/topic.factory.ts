import { CreateTopicDto } from "../dto/create-topic.dto";
import { UpdateTopicDto } from "../dto/update-topic.dto";
import { Topic } from "../entities/topic.entity";

export class TopicFactory {
  /**
   * Creates a new topic based on the given new content, or updates the given source topic.
   *
   * If source is not provided, a new topic is created.
   * If source is provided, the topic is updated with the given new content.
   * The version of the topic is incremented by one, if it exists.
   *
   * @param newContent The new content to create or update the topic with.
   * @param source The topic to update, if any.
   * @returns The created or updated topic.
   */
  create(newContent: CreateTopicDto | UpdateTopicDto, source?: Topic): Topic {
    const topic = source ?? new Topic();

    topic.name = newContent.name ?? topic.name;
    topic.content = newContent.content ?? topic.content;
    topic.version = topic.version ? topic.version + 1 : 1;

    return topic;
  }
}
