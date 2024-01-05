import mongoose, { Schema, Document } from "mongoose";
import { IAnalyticsEvent } from "./analytics.event.interface.js";

export interface ICommentAnalyticsEvent extends IAnalyticsEvent {
  threadId: mongoose.Types.ObjectId;
  commentId: mongoose.Types.ObjectId;
}

const PersistentCommentAnalyticsSchema: Schema = new Schema(
  {
    threadId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventType: { type: String, required: true },
    eventValue: { type: String, required: true },
  },
  { timestamps: true }
);

// index for searching if user have done certain event for a comment
PersistentCommentAnalyticsSchema.index(
  {
    threadId: 1,
    eventType: 1,
    userId: 1,
    commentId: 1,
  },
  { unique: true }
);

export const PersistentCommentAnalytics =
  mongoose.model<ICommentAnalyticsEvent>(
    "PersistentCommentAnalytics",
    PersistentCommentAnalyticsSchema
  );

/*
// For future use, like adding analytics when user browse a Thread
// setting ttl of the analytics record as 1 min for below example
const TemporaryCommentAnalyticsSchema: Schema = new Schema(
  {
    threadId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventType: { type: String, required: true },
    eventValue: { type: String, required: true },
    expiredAt: { type: Date, default: Date.now, index: { expires: "1m" } },
  },
  { timestamps: true }
);

TemporaryCommentAnalyticsSchema.index({
  threadId: 1,
  userId: 1,
  eventType: 1,
  commentId: 1,
});

export const TemporaryCommentAnalytics = mongoose.model<ICommentAnalyticsEvent>(
  "TemporaryCommentAnalytics",
  TemporaryCommentAnalyticsSchema
);
*/
