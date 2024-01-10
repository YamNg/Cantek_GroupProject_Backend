import { TopicDto } from "./topic.dto.js";

export class SectionDto {
  _id: string;
  title: string;
  topics: any[];

  constructor(threadDocument: any) {
    this._id = threadDocument._id;
    this.title = threadDocument.title;
    this.topics = threadDocument.topics?.map(
      (topic: any) => new TopicDto(topic)
    );
  }
}
