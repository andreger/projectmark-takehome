import { ArchivedTopicVersion } from "./archived-topic-version";
import { CurrentTopicVersion } from "./current-topic-version";

export enum TopicVersionType {
  CURRENT = "Current",
  ARQUIVED = "Arquived",
}

export class TopicVersionFactory {
  getVersion(
    type: TopicVersionType
  ): CurrentTopicVersion | ArchivedTopicVersion {
    switch (type) {
      case TopicVersionType.CURRENT:
        return new CurrentTopicVersion();
      case TopicVersionType.ARQUIVED:
        return new ArchivedTopicVersion();
    }
  }
}
