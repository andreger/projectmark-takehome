import { AppDataSource } from "../shared/database";
import { InternalServerError, NotFoundError } from "../shared/errors";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { TopicVersion } from "./entities/topic-version.entity";
import { Topic } from "./entities/topic.entity";
import { IVersionFactory } from "./factories/IVersionFactory";
import { StandardVersionFactory } from "./factories/StandardVersionFactory";

export class TopicService {
  private topicRepository = AppDataSource.getRepository(Topic);
  private versionFactory: IVersionFactory = new StandardVersionFactory();

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

    return await this.topicRepository.save(topic);
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

      // Create version history
      await manager.save(TopicVersion, {
        ...currentTopic,
        id: undefined,
        createdAt: currentTopic.updatedAt,
        topic: currentTopic,
      });

      // Create new version
      const newVersion = this.versionFactory.createVersion(
        currentTopic,
        dto.content ?? ""
      );

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
      await manager.delete(TopicVersion, { topic: { id } });

      // Delete the topic itself
      await manager.delete(Topic, id);
    });
  }

  async getTopicTree(id: string): Promise<any> {
    const topic = await this.topicRepository.findOne({
      where: { id },
      relations: ["children"],
    });

    if (!topic) throw new NotFoundError("Topic not found");

    const children = await Promise.all(
      topic.children.map((child) => this.getTopicTree(child.id))
    );

    return { ...topic, children };
  }
}
