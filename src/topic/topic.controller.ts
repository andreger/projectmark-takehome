import { NextFunction, Request, Response } from "express";
import { TopicService } from "./topic.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { NotFoundError } from "../shared/errors";
import { PermissionContext } from "../user/permissions/permission-context";
import { TokenPayload } from "../auth/dto/token-payload";

export class TopicController {
  private topicService = new TopicService();

  async listTopics(_req: Request, res: Response) {
    const topics = await this.topicService.listTopics();
    res.json(topics);
  }

  async createTopic(req: Request, res: Response) {
    const dto: CreateTopicDto = req.body;
    const topic = await this.topicService.createTopic(dto);
    res.status(201).json(topic);
  }

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

  async updateTopic(req: Request, res: Response) {
    const { id } = req.params;
    const dto: UpdateTopicDto = req.body;
    const topic = await this.topicService.updateTopic(id, dto);
    res.json(topic);
  }

  async deleteTopic(req: Request, res: Response) {
    const { id } = req.params;
    await this.topicService.deleteTopic(id);
    res.status(204).send();
  }

  async getTopicTree(req: Request, res: Response) {
    const { id } = req.params;
    const tree = await this.topicService.getTopicTree(id);
    res.json(tree);
  }
}
