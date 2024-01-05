import mongoose, { Schema, Document } from "mongoose";
import { IComment } from "./comment.model.js";

interface IThread extends Document {
  topicId: mongoose.Types.ObjectId;
  title: string;
  comments: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  active: boolean;
  metadata: IThreadMetaData;
}

interface IThreadMetaData extends Document {
  commentCount: number;
}

const ThreadSchema: Schema = new Schema(
  {
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    title: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    active: { type: Boolean, default: true },
    metadata: {
      commentCount: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

ThreadSchema.virtual("author", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

ThreadSchema.virtual("content", {
  ref: "Comment",
  localField: "comments",
  foreignField: "_id",
  justOne: true,
});

ThreadSchema.set("toObject", { virtuals: true });
ThreadSchema.set("toJSON", { virtuals: true });

// for retrieve post history of a user
ThreadSchema.index({ userId: 1, _id: -1 });

export const Thread = mongoose.model<IThread>("Thread", ThreadSchema);
