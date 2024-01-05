import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  threadId: mongoose.Types.ObjectId;
  threadCommentNum: number;
  content: string;
  userId: mongoose.Types.ObjectId;
  active: boolean;
  metadata: ICommentMetaData;
}

interface ICommentMetaData extends Document {
  upvote: number;
  downvote: number;
  ancestor: mongoose.Types.ObjectId[];
  children: mongoose.Types.ObjectId[];
}

const CommentSchema: Schema = new Schema(
  {
    threadId: { type: Schema.Types.ObjectId, ref: "Thread" },
    threadCommentNum: { type: Number, default: 0 },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    active: { type: Boolean, default: true },
    metadata: {
      upvote: { type: Number, default: 0 },
      downvote: { type: Number, default: 0 },
      ancestor: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
      children: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    },
  },
  { timestamps: true }
);

CommentSchema.virtual("author", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

CommentSchema.set("toObject", { virtuals: true });
CommentSchema.set("toJSON", { virtuals: true });

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
