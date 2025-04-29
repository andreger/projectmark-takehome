import { Resource } from "./entities/resource.entity";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { BadRequestError, NotFoundError } from "../shared/errors";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { Repository } from "typeorm";
import { TopicService } from "../topic/topic.service";

export class ResourceService {
  constructor(
    private readonly resourceRepository: Repository<Resource>,
    private readonly topicService: TopicService
  ) {}

  /**
   * Creates a new resource and saves it to the database.
   * @param dto An object that contains the resource's information.
   * @returns The newly created resource.
   */
  async createResource(dto: CreateResourceDto): Promise<Resource> {
    const resource = this.resourceRepository.create(dto);

    const topic = await this.topicService.getTopic(dto.topicId);

    if (!topic) throw new BadRequestError("Topic not found");

    resource.topic = topic;

    return this.resourceRepository.save(resource);
  }

  /**
   * Retrieves all resources.
   *
   * @returns An array of resources
   */
  async listResources(): Promise<Resource[]> {
    return this.resourceRepository.find();
  }

  /**
   * Retrieves a resource by ID.
   *
   * @param id The resource's ID
   * @returns The resource with the specified ID
   */
  async getResource(id: string): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({
      where: { id },
    });

    if (!resource) throw new NotFoundError("Resource not found");

    return resource;
  }

  /**
   * Updates a resource by ID.
   *
   * @param id The resource's ID
   * @param dto An object that contains the resource's updated information.
   * @returns The updated resource
   */
  async updateResource(id: string, dto: UpdateResourceDto): Promise<Resource> {
    const resource = await this.resourceRepository.preload({
      id,
      ...dto,
      topic: dto.topicId ? { id: dto.topicId } : undefined,
    });

    if (!resource) throw new NotFoundError("Resource not found");

    await this.resourceRepository.save(resource); // persists both scalars & relations
    return this.getResource(id);
  }

  /**
   * Deletes a resource by ID.
   *
   * @param id The resource's ID
   */
  async deleteResource(id: string): Promise<void> {
    const resource = await this.resourceRepository.findOne({
      where: { id },
    });

    if (!resource) throw new NotFoundError("Resource not found");

    await this.resourceRepository.delete(id);
  }
}
