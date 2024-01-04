import mongoose, { Schema, Document } from "mongoose";

export interface ICommentAnalyticsEvent extends Document {
  userId: string;
  eventType: string;
}

const CommentAnalyticsEventSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventType: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
  },
});

export const CommentAnalyticsEvent = mongoose.model<ICommentAnalyticsEvent>(
  "CommentAnalyticsEvent",
  CommentAnalyticsEventSchema
);
