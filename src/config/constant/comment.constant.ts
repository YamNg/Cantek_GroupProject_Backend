import { IAnalyticsConstants } from "./analytics.constant.interface.js";

export const CommentConstants = {
  pageSize: 25,
};

export const CommentAnalyticsConstants: IAnalyticsConstants = {
  vote: {
    eventType: "VOTE",
    eventValues: {
      upvote: "upvote",
      downvote: "downvote",
    },
  },
};
