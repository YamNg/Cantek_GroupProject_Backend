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

/* User related error */
export const UserNotFound: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "USER_NOT_FOUND",
  message: "Cannot find the user in server",
};

export const UserEmailOccupied: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "EMAIL_OCCUPIED",
  message: "Email is already registered",
};

export const IncorrectUserEmailOrPassword: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "INCORRECT_USER_EMAIL_OR_PASSWORD",
  message: "Incorrect email or password",
};

export const InvalidUsername: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "INVALID_USERNAME",
  message: "Invalid username",
};

export const InvalidUserEmailOrPassword: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "INVALID_USER_EMAIL_OR_PASSWORD",
  message: "login credential format do not meet system requirement",
};

/* middleware error */
export const MissingToken: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "MISSING_TOKEN",
  message: "missing access token or refresh token",
};

export const TokenVerificationError: IAppErrorConstant = {
  statusCode: 400,
  errorCode: "TOKEN_VERIFICATION_ERROR",
  message: "unable to verify or refresh token",
};
