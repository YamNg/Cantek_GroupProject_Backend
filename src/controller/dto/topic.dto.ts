export class TopicDto {
  _id: string;
  sectionId: string;
  title: string;

  constructor(threadDocument: any) {
    this._id = threadDocument._id;
    this.sectionId = threadDocument.sectionId;
    this.title = threadDocument.title;
  }
}
