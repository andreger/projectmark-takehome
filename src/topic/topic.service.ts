import { AppDataSource } from "../shared/database";
import { InternalServerError, NotFoundError } from "../shared/errors";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { TopicHistory } from "./entities/topic-history.entity";
import { Topic } from "./entities/topic.entity";
import {
  TopicVersionFactory,
  TopicVersionType,
} from "./factories/topic-version.factory";

export class TopicService {
  private topicRepository = AppDataSource.getRepository(Topic);
  private topicVersionFactory: TopicVersionFactory = new TopicVersionFactory();

  async listTopics(): Promise<Topic[]> {
    const queryBuilder = this.topicRepository.createQueryBuilder("topic");
    return queryBuilder.getMany();
  }

  async createTopic(dto: CreateTopicDto): Promise<Topic> {
    const topic = new Topic();
    topic.name = dto.name;
    topic.content = dto.content;

    if (dto.parentTopicId) {
      const parentTopic = await this.topicRepository.findOneBy({
        id: dto.parentTopicId,
      });

      if (!parentTopic) throw new NotFoundError("Parent topic not found");

      topic.parentTopic = parentTopic;
    }

    const newTopic = this.topicVersionFactory
      .getVersion(TopicVersionType.CURRENT)
      .createTopicVersion(topic);

    return await this.topicRepository.save(newTopic);
  }

  async getTopic(id: string, version?: number): Promise<Topic | null> {
    if (version) {
      return this.topicRepository.findOne({
        where: { id, version },
      });
    }

    // Return latest version by default
    return this.topicRepository.findOne({
      where: { id },
      order: { version: "DESC" },
    });
  }

  async updateTopic(id: string, dto: UpdateTopicDto): Promise<Topic> {
    return this.topicRepository.manager.transaction(async (manager) => {
      // Get the current version
      const currentTopic = await manager.findOne(Topic, {
        where: { id },
      });

      if (!currentTopic) throw new NotFoundError("Topic not found");

      // Create topic history
      const topicHistory = this.topicVersionFactory
        .getVersion(TopicVersionType.ARQUIVED)
        .createTopicVersion(currentTopic);

      await manager.save(TopicHistory, topicHistory);

      // Create new version
      if (dto.name) {
        currentTopic.name = dto.name;
      }
      if (dto.content) {
        currentTopic.content = dto.content;
      }

      const newVersion = this.topicVersionFactory
        .getVersion(TopicVersionType.CURRENT)
        .createTopicVersion(currentTopic);

      await manager.update(Topic, id, newVersion);

      // Return updated entity
      const updatedTopic = await manager.findOne(Topic, { where: { id } });
      if (!updatedTopic)
        throw new InternalServerError("Failed to retrieve updated topic");

      return updatedTopic;
    });
  }

  async deleteTopic(id: string): Promise<void> {
    await this.topicRepository.manager.transaction(async (manager) => {
      const topic = await manager.findOne(Topic, {
        where: { id },
        relations: ["versions"],
      });

      if (!topic) throw new NotFoundError("Topic not found");

      // Delete all versions related to the topic
      await manager.delete(TopicHistory, { topic: { id } });

      // Delete the topic itself
      await manager.delete(Topic, id);
    });
  }

  async getTopicTree(id: string): Promise<any> {
    const buildTree = async (topicId: string): Promise<any> => {
      const topic = await this.topicRepository.findOne({
        where: { id: topicId },
        relations: ["children"],
      });

      if (!topic) throw new NotFoundError("Topic not found");

      const children = await Promise.all(
        topic.children.map((child) => buildTree(child.id))
      );

      return { ...topic, children };
    };

    return buildTree(id);
  }
}
