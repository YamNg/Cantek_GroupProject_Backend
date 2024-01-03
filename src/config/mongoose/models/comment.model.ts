import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  threadId: mongoose.Types.ObjectId;
  content: string;
  userId: mongoose.Types.ObjectId;
  active: boolean;
  analytics: ICommentAnalytics;
}

interface ICommentAnalytics extends Document {
  upvote: number;
  downvote: number;
}

const CommentSchema: Schema = new Schema(
  {
    threadId: { type: Schema.Types.ObjectId, ref: "Thread", required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    active: { type: Boolean, default: true },
    analytics: {
      upvote: { type: Number, default: 0 },
      downvote: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
