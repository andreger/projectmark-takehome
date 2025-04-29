import { Request, Response } from "express";
import { ResourceService } from "./resource.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";

export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  /**
   * Retrieves all resources.
   *
   * Retrieves all resources from the database and responds with their data in JSON format.
   *
   * @param _req The request containing no parameters
   * @param res The response containing the list of resources
   */
  async listResources(_req: Request, res: Response) {
    const resources = await this.resourceService.listResources();
    res.json(resources);
  }

  /**
   * Retrieves a resource by ID.
   *
   * Extracts the resource ID from the request parameters and retrieves the corresponding resource.
   * If the resource is not found, passes a NotFoundError to the next middleware.
   * Otherwise, responds with the resource data in JSON format.
   *
   * @param req The request containing the resource ID
   * @param res The response containing the resource data
   */

  async getResource(req: Request, res: Response) {
    const { id } = req.params;
    const resource = await this.resourceService.getResource(id);
    res.json(resource);
  }

  /**
   * Creates a new resource.
   *
   * Retrieves the resource data from the request body and creates a new resource in the database.
   * Responds with the newly created resource data in JSON format and a 201 status code.
   *
   * @param req The request containing the resource data
   * @param res The response containing the newly created resource
   */
  async createResource(req: Request, res: Response) {
    const dto: CreateResourceDto = req.body;
    const resource = await this.resourceService.createResource(dto);
    res.status(201).json(resource);
  }

  /**
   * Updates a resource.
   *
   * Retrieves the resource ID from the request parameters and the update data from the request body.
   * Updates the resource using the provided data and responds with the updated resource data in JSON format.
   *
   * @param req The request containing the resource ID and update data
   * @param res The response containing the updated resource
   */
  async updateResource(req: Request, res: Response) {
    const { id } = req.params;
    const dto: UpdateResourceDto = req.body;
    const resource = await this.resourceService.updateResource(id, dto);
    res.json(resource);
  }

  /**
   * Deletes a resource by ID.
   *
   * Retrieves the resource ID from the request parameters and deletes the resource from the database.
   * Responds with a 204 status code if the deletion is successful.
   *
   * @param req The request containing the resource ID
   * @param res The response indicating the status of the deletion
   */

  async deleteResource(req: Request, res: Response) {
    const { id } = req.params;
    await this.resourceService.deleteResource(id);
    res.status(204).send();
  }
}
