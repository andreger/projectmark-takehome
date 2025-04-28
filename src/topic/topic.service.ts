import { AppDataSource } from "../shared/database";
import { BadRequestError, NotFoundError } from "../shared/errors";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { TopicHistory } from "./entities/topic-history.entity";
import { Topic } from "./entities/topic.entity";
import { TopicHistoryFactory } from "./factories/topic-history.factory";
import { TopicFactory } from "./factories/topic.factory";

export class TopicService {
  private topicRepository = AppDataSource.getTreeRepository(Topic);
  private topicFactory: TopicFactory = new TopicFactory();
  private topicHistoryFactory: TopicHistoryFactory = new TopicHistoryFactory();

  async listTopics(): Promise<Topic[]> {
    return this.topicRepository.findTrees();
  }

  /**
   * Creates a topic.
   *
   * If parentTopicId is specified, it will create the topic as a child of the
   * specified parent topic. If parentTopicId is not specified, it will create
   * the topic as a root node.
   *
   * @param dto The create topic data
   * @throws {BadRequestError} If parentTopicId is specified but the parent topic is not found
   * @returns The created topic
   */
  async createTopic(dto: CreateTopicDto): Promise<Topic> {
    return this.topicRepository.manager.transaction(async (manager) => {
      // Create and save the topic
      const topic = this.topicFactory.create(dto);

      if (dto.parentTopicId) {
        const parent = await manager.findOne(Topic, {
          where: { id: dto.parentTopicId },
        });
        if (!parent) throw new BadRequestError("Parent topic not found");

        parent.add(topic);
        await manager.save(parent);
      } else {
        // root node
        await manager.save(topic);
      }

      // Create and save the topic history
      const history = this.topicHistoryFactory.create(topic);
      await manager.save(TopicHistory, history);

      return topic;
    });
  }

  /**
   * Finds a topic by id and optional version.
   *
   * If version is specified, it will return the topic with that version.
   * If version is not specified, it will return the latest version of the topic.
   *
   * It will return null if the topic is not found.
   *
   * @param id The id of the topic to find
   * @param version The version of the topic to find
   * @returns The topic with the specified id and version, or null if not found
   */
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
      relations: ["parentTopic", "children"],
    });
  }

  /**
   * Updates a topic and its history.
   * @param id The topic's id
   * @param dto The update data
   * @returns The updated topic
   * @throws {NotFoundError} If the topic is not found
   * @throws {InternalServerError} If the update fails
   */
  async updateTopic(id: string, dto: UpdateTopicDto): Promise<Topic> {
    return this.topicRepository.manager.transaction(async (manager) => {
      // Find the current topic
      const current = await manager.findOne(Topic, {
        where: { id },
        relations: ["parentTopic"],
      });

      if (!current) throw new NotFoundError("Topic not found");

      // Update the topic
      const updatedTopic = this.topicFactory.create(dto, current);
      await manager.update(Topic, id, updatedTopic);

      // Create and save the topic history
      const history = this.topicHistoryFactory.create(updatedTopic);
      await manager.save(TopicHistory, history);

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

  async getTopicTree(id: string): Promise<Topic> {
    const root = await this.topicRepository.findOneBy({ id });
    if (!root) throw new NotFoundError("Topic not found");
    return this.topicRepository.findDescendantsTree(root);
  }
}
