export interface CreateTopicDto {
  name: string;
  content: string;
  parentTopicId?: string;
}
