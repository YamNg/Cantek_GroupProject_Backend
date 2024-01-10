import { ThreadConstants } from "../../config/constant/thread.constant.js";
import { CommentDto } from "./comment.dto.js";
import { TopicDto } from "./topic.dto.js";

export class ThreadListDto {
  topic?: TopicDto;
  threads: ThreadListItemDto[];

  constructor(threadDocument: any) {
    this.topic = threadDocument.topic;
    this.threads = threadDocument.threads;
  }
}

export class ThreadListItemDto {
  _id: string;
  topicId?: string;
  topicTitle?: string;
  title: string;
  vote: number;
  username: string;
  createdAt: Date;

  constructor(threadDocument: any) {
    this._id = threadDocument._id;
    this.topicId = threadDocument.topicId;
    this.topicTitle = threadDocument.topic?.title;
    this.title = threadDocument.title;

    const { upvote, downvote } = threadDocument.content.metadata;
    this.vote = upvote - downvote;

    this.username = threadDocument.author.username;
    this.createdAt = threadDocument.createdAt;
  }
}

export class ThreadDto {
  _id: string;
  topicId: string;
  title: string;
  comments: any[];
  userId: string;
  createdAt: Date;
  totalPage: number;

  constructor(threadDocument: any) {
    this._id = threadDocument._id;
    this.topicId = threadDocument.topicId;
    this.title = threadDocument.title;
    this.comments = threadDocument.comments.map(
      (comment: any) => new CommentDto(comment)
    );
    this.userId = threadDocument.userId;
    this.createdAt = threadDocument.createdAt;
    this.totalPage = Math.ceil(
      threadDocument.metadata.commentCount / ThreadConstants.pageSize
    );
  }
}
