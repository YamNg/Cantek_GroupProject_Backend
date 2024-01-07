export interface IAppErrorConstant {
  statusCode: number;
  errorCode: string;
  message: string;
}

/* Section related error */
export const SectionNotFound: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "SECTION_NOT_FOUND",
  message: "Related section not found, action aborted",
};

/* Topic related error */
export const TopicNotFound: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "TOPIC_NOT_FOUND",
  message: "Related topic not found, action aborted",
};

/* Comment related error */
export const CommentNotFound: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "COMMENT_NOT_FOUND",
  message: "Related comment not found, action aborted",
};

export const ParentCommentNotFound: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "PARENT_COMMENT_NOT_FOUND",
  message: "Replying comment not found, action aborted",
};

export const CommentVoteExists: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "COMMENT_VOTE_EXISTS",
  message: "Vote of comment for user already exists",
};

/* Thread related error */
export const ThreadNotFound: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "THREAD_NOT_FOUND",
  message: "Related thread not found, action aborted",
};
