import { Request, Response } from "express";
import { TopicService } from "./topic.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { instanceToPlain } from "class-transformer";

export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  /**
   * Retrieves all topics.
   *
   * @returns An array of topics
   */
  async listTopics(_req: Request, res: Response) {
    const topics = await this.topicService.listTopics();
    res.json(topics);
  }

  /**
   * Creates a topic.
   *
   * If parentId is specified in the request body, it will create the topic as a child of the
   * specified parent topic. If parentId is not specified, it will create the topic as a root node.
   *
   * The created topic is returned in the response.
   *
   * @param req The request containing the topic data
   * @param res The response containing the created topic
   * @throws {BadRequestError} If parentId is specified but the parent topic is not found
   */
  async createTopic(req: Request, res: Response) {
    const dto: CreateTopicDto = req.body;
    const topic = await this.topicService.createTopic(dto);
    res.status(201).json(
      instanceToPlain(topic, {
        enableCircularCheck: true,
      })
    );
  }

  /**
   * Retrieves a topic by id.
   *
   * @param req The request containing the topic id
   * @param res The response containing the topic
   * @throws {NotFoundError} If the topic is not found
   */
  async getTopic(req: Request, res: Response) {
    const { id } = req.params;
    const topic = await this.topicService.getTopic(id);
    res.json(topic);
  }

  /**
   * Retrieves a topic history by id and version.
   *
   * Retrieves the topic id and version from the request parameters and the topic history from the database.
   * Responds with the topic history, or a 404 error if the topic or version is not found.
   *
   * @param req The request containing the topic id and version
   * @param res The response containing the topic history
   */
  async getTopicHistory(req: Request, res: Response) {
    const { id, version } = req.params;
    const topic = await this.topicService.getTopicHistory(id, Number(version));
    res.json(topic);
  }

  /**
   * Updates a topic by id.
   *
   * Retrieves the topic id from the request parameters and the update data from the request body.
   * Updates the topic using the provided data and responds with the updated topic.
   *
   * @param req The request containing the topic id and update data
   * @param res The response containing the updated topic
   */
  async updateTopic(req: Request, res: Response) {
    const { id } = req.params;
    const dto: UpdateTopicDto = req.body;
    const topic = await this.topicService.updateTopic(id, dto);
    res.json(topic);
  }

  /**
   * Deletes a topic by id.
   *
   * Retrieves the topic id from the request parameters and deletes the topic.
   * Responds with a 204 status code if the deletion is successful.
   *
   * @param req The request containing the topic id
   * @param res The response containing the status code
   * @throws {NotFoundError} If the topic is not found
   * @throws {InternalServerError} If the deletion fails
   */
  async deleteTopic(req: Request, res: Response) {
    const { id } = req.params;
    await this.topicService.deleteTopic(id);
    res.status(204).send();
  }

  /**
   * Retrieves a topic and all its descendants as a tree.
   *
   * @param req The request containing the topic id
   * @param res The response containing the topic and its descendants as a nested object
   * @throws {NotFoundError} If the topic is not found
   */
  async getTopicTree(req: Request, res: Response) {
    const { id } = req.params;
    const tree = await this.topicService.getTopicTree(id);
    res.json(tree);
  }

  /**
   * Finds the shortest path from one topic to another.
   *
   * Retrieves the from id and to id from the request parameters and finds the
   * shortest path between the two topics. Responds with the path, or a 404 error
   * if the from or to topic is not found.
   *
   * @param req The request containing the from and to topic ids
   * @param res The response containing the path
   * @throws {NotFoundError} If the from or to topic is not found
   */
  async getShortestPath(req: Request, res: Response) {
    const { fromId, toId } = req.params;
    const path = await this.topicService.findShortestPath(fromId, toId);
    res.json(path);
  }
}
