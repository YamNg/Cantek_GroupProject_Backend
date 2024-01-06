export class CommentDto {
  _id: string;
  threadId: string;
  threadCommentNum: number;
  upvote: number;
  downvote: number;
  ancestor: string[];
  children: string[];
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;

  constructor(commentDocument: any) {
    this._id = commentDocument._id;
    this.threadId = commentDocument.threadId;
    this.threadCommentNum = commentDocument.threadCommentNum;
    this.upvote = commentDocument.metadata.upvote;
    this.downvote = commentDocument.metadata.downvote;
    this.ancestor = commentDocument.metadata.ancestor;
    this.children = commentDocument.metadata.children;
    this.content = commentDocument.content;
    this.author = commentDocument.author.username;
    this.authorId = commentDocument.author._id;
    this.createdAt = commentDocument.createdAt;
  }
}
