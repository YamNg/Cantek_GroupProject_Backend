import mongoose, { Schema, Document } from "mongoose";

interface ITopic extends Document {
  sectionId: mongoose.Types.ObjectId;
  title: string;
  active: boolean;
}

const TopicSchema: Schema = new Schema({
  sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
  title: { type: String, required: true },
  active: { type: Boolean, default: false },
});

export const Topic = mongoose.model<ITopic>("Topic", TopicSchema);
