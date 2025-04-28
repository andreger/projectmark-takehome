import { NextFunction, Request, Response } from "express";
import { TopicService } from "./topic.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { NotFoundError } from "../shared/errors";
import { instanceToPlain } from "class-transformer";

export class TopicController {
  private topicService = new TopicService();

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
   * If parentTopicId is specified in the request body, it will create the topic as a child of the
   * specified parent topic. If parentTopicId is not specified, it will create the topic as a root node.
   *
   * The created topic is returned in the response.
   *
   * @param req The request containing the topic data
   * @param res The response containing the created topic
   * @throws {BadRequestError} If parentTopicId is specified but the parent topic is not found
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
  async getTopic(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { version } = req.query;
    const topic = await this.topicService.getTopic(
      id,
      version ? Number(version) : undefined
    );

    if (!topic) return next(new NotFoundError("Topic not found"));

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
}
