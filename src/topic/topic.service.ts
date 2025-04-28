import { Repository, TreeRepository } from "typeorm";
import { BadRequestError, NotFoundError } from "../shared/errors";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { TopicHistory } from "./entities/topic-history.entity";
import { Topic } from "./entities/topic.entity";
import { TopicHistoryFactory } from "./factories/topic-history.factory";
import { TopicFactory } from "./factories/topic.factory";

export class TopicService {
  constructor(
    private readonly topicRepository: TreeRepository<Topic>,
    private readonly topicHistoryRepository: Repository<TopicHistory>,
    private readonly topicFactory: TopicFactory,
    private readonly topicHistoryFactory: TopicHistoryFactory
  ) {}

  /**
   * Retrieves all topics.
   *
   * @returns An array of topics
   */
  async listTopics(): Promise<Topic[]> {
    return this.topicRepository.find();
  }

  /**
   * Creates a topic.
   *
   * If parentId is specified, it will create the topic as a child of the
   * specified parent topic. If parentId is not specified, it will create
   * the topic as a root node.
   *
   * @param dto The create topic data
   * @throws {BadRequestError} If parentId is specified but the parent topic is not found
   * @returns The created topic
   */
  async createTopic(dto: CreateTopicDto): Promise<Topic> {
    return this.topicRepository.manager.transaction(async (manager) => {
      // Create and save the topic
      const topic = this.topicFactory.create(dto);

      if (dto.parentId) {
        const parent = await manager.findOne(Topic, {
          where: { id: dto.parentId },
        });
        if (!parent) throw new BadRequestError("Parent topic not found");

        parent.add(topic);
      }
      await manager.save(topic);

      // Create and save the topic history
      const history = this.topicHistoryFactory.create(topic);
      await manager.save(TopicHistory, history);

      return topic;
    });
  }

  /**
   * Retrieves a topic by id.
   *
   * @param id The topic's id
   * @returns The topic with the specified id, or null if not found
   */
  async getTopic(id: string): Promise<Topic | null> {
    return this.topicRepository.findOne({
      where: { id },
    });
  }

  /**
   * Retrieves the history of a specific topic version by id.
   *
   * @param id The id of the topic to retrieve history for
   * @param version The version number of the topic to retrieve
   * @returns The topic history of the specified version, or null if not found
   */

  async getTopicHistory(
    id: string,
    version: number
  ): Promise<TopicHistory | null> {
    return this.topicHistoryRepository.findOne({
      where: { topic: { id }, version },
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
        relations: ["parent"],
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

  /**
   * Deletes a topic and all its versions.
   *
   * @param id The topic's id
   * @throws {NotFoundError} If the topic is not found
   * @throws {InternalServerError} If the deletion fails
   */
  async deleteTopic(id: string): Promise<void> {
    await this.topicRepository.manager.transaction(async (manager) => {
      const topic = await manager.findOne(Topic, {
        where: { id },
      });

      if (!topic) throw new NotFoundError("Topic not found");

      // Delete all versions related to the topic
      await manager.delete(TopicHistory, { topic: { id } });

      // Delete the topic itself
      await manager.delete(Topic, id);
    });
  }

  /**
   * Retrieves a topic and all its descendants as a tree.
   *
   * @param id The topic's id
   * @throws {NotFoundError} If the topic is not found
   * @returns The topic and its descendants as a nested object
   */
  async getTopicTree(id: string): Promise<Topic> {
    const root = await this.topicRepository.findOneBy({ id });
    if (!root) throw new NotFoundError("Topic not found");
    return this.topicRepository.findDescendantsTree(root);
  }
}
