import { NextFunction, Request, Response } from "express";
import { TopicService } from "./topic.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { NotFoundError } from "../shared/errors";

export class TopicController {
  private topicService = new TopicService();

  async listTopics(req: Request, res: Response) {
    try {
      const topics = await this.topicService.listTopics();
      res.json(topics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTopic(req: Request, res: Response) {
    try {
      const dto: CreateTopicDto = req.body;
      const topic = await this.topicService.createTopic(dto);
      res.status(201).json(topic);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTopic(req: Request, res: Response, next: NextFunction) {
    // try {
    //   const { id } = req.params;
    //   const { version } = req.query;
    //   const topic = await this.topicService.getTopic(
    //     id,
    //     version ? Number(version) : undefined
    //   );
    //   topic
    //     ? res.json(topic)
    //     : res.status(404).json({ error: "Topic not found" });
    // } catch (error: any) {
    //   res.status(500).json({ error: error.message });
    // }
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
    try {
      // const user = req.user as User;
      // const permission = new PermissionContext(user);

      // if (!permission.canEditTopic(user, existingTopic)) {
      //   return res.status(403).json({ error: "Forbidden" });
      // }

      const { id } = req.params;
      const dto: UpdateTopicDto = req.body;
      const topic = await this.topicService.updateTopic(id, dto);
      res.json(topic);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTopic(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.topicService.deleteTopic(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTopicTree(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tree = await this.topicService.getTopicTree(id);
      tree
        ? res.json(tree)
        : res.status(404).json({ error: "Topic not found" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
