import { TopicHistory } from "../entities/topic-history.entity";
import { Topic } from "../entities/topic.entity";

export class TopicHistoryFactory {
  create(topic: Topic): TopicHistory {
    const topicHistory = new TopicHistory();

    topicHistory.name = topic.name;
    topicHistory.content = topic.content;
    topicHistory.version = topic.version;
    topicHistory.topic = topic;

    return topicHistory;
  }
}
