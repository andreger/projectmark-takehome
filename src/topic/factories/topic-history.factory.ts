import { TopicHistory } from "../entities/topic-history.entity";
import { Topic } from "../entities/topic.entity";

export class TopicHistoryFactory {
  /**
   * Creates a new topic history by copying the properties of the given topic.
   * This is used when a topic is updated, to create a new version of the topic
   * in the history table.
   *
   * @param topic The topic to create a history entry for.
   * @returns A new topic history object.
   */
  create(topic: Topic): TopicHistory {
    const topicHistory = new TopicHistory();

    topicHistory.name = topic.name;
    topicHistory.content = topic.content;
    topicHistory.version = topic.version;
    topicHistory.topic = topic;

    return topicHistory;
  }
}
