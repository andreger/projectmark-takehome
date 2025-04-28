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

  /**
   * Finds the shortest path between two topics in the hierarchy.
   *
   * If the starting topic ID and ending topic ID are the same, the path will
   * only contain that single topic. Otherwise, it constructs the ancestor
   * chains for both topics and finds their lowest common ancestor (LCA).
   * The path is then constructed as a combination of the path from the starting
   * topic to the LCA and the path from the LCA's child to the ending topic.
   *
   * @param fromId The ID of the starting topic.
   * @param toId The ID of the ending topic.
   * @returns A promise that resolves to an array of topics representing the shortest path.
   * @throws {NotFoundError} If the topics are in different trees or a topic is not found.
   */

  async findShortestPath(fromId: string, toId: string): Promise<Topic[]> {
    if (fromId === toId) return this.singleNodePath(fromId);

    const chainA = await this.buildAncestorChain(fromId);
    const chainB = await this.buildAncestorChain(toId);

    const { lcaA, lcaB } = this.findLowestCommonAncestor(chainA, chainB);

    if (lcaA === -1) throw new NotFoundError("Topics are in different trees");

    return [...chainA.slice(0, lcaA + 1), ...chainB.slice(0, lcaB).reverse()];
  }

  /**
   * Retrieves a single topic as an array containing only that topic.
   *
   * @param id The ID of the topic to retrieve.
   * @returns A promise that resolves to an array with the single topic if found.
   * @throws {NotFoundError} If the topic is not found.
   */

  private async singleNodePath(id: string): Promise<Topic[]> {
    const node = await this.topicRepository.findOne({ where: { id } });

    if (!node) throw new NotFoundError("Topic not found");

    return [node];
  }

  /**
   * Constructs the ancestor chain for a given topic.
   *
   * Starting from the topic with the specified ID, this method traverses
   * up through the topic's ancestors, collecting each ancestor into an array.
   * The traversal stops once a topic without a parent is reached.
   *
   * @param id The ID of the topic to start the ancestor chain from.
   * @returns A promise that resolves to an array of topics representing the ancestor chain.
   *          The array starts with the topic itself and ends with the root ancestor.
   */

  private async buildAncestorChain(id: string): Promise<Topic[]> {
    const chain: Topic[] = [];
    let current = await this.getTopicSummary(id);

    while (current) {
      chain.push(current);

      if (!current.parent) break;

      current = await this.getTopicSummary(current.parent.id);
    }

    return chain;
  }

  /**
   * Fetches a lightweight version of a topic, with only the properties needed
   * for building an ancestor chain.
   *
   * @param id The ID of the topic to fetch.
   * @returns A promise that resolves to an object with the topic's ID, name, and parent.
   */
  private getTopicSummary(id: string) {
    return this.topicRepository.findOne({
      where: { id },
      select: ["id", "name"],
      relations: ["parent"],
    });
  }

  /**
   * Finds the lowest common ancestor (LCA) of two topic chains.
   *
   * Given two chains of topics (A and B), this method finds the deepest topic
   * that is an ancestor of both chains. The method returns an object with two
   * properties: `lcaA` and `lcaB`, which represent the positions of the LCA
   * in the two chains, respectively.
   *
   * If the two chains do not share a common ancestor, the method returns
   * an object with `lcaA` and `lcaB` set to -1.
   *
   * @param chainA The first topic chain.
   * @param chainB The second topic chain.
   * @returns An object with two properties: `lcaA` and `lcaB`, which represent
   *          the positions of the LCA in the two chains, respectively.
   */
  private findLowestCommonAncestor(
    chainA: Topic[],
    chainB: Topic[]
  ): { lcaA: number; lcaB: number } {
    const indexChainA = new Map(chainA.map((n, i) => [n.id, i]));

    for (let j = 0; j < chainB.length; j++) {
      const pos = indexChainA.get(chainB[j].id);

      if (pos !== undefined) return { lcaA: pos, lcaB: j };
    }

    return { lcaA: -1, lcaB: -1 }; // different roots
  }
}
