import mongoose, { Schema, Document } from "mongoose";

interface ISection extends Document {
  title: string;
  active: boolean;
  topics: mongoose.Types.ObjectId[];
}

const SectionSchema: Schema = new Schema({
  title: { type: String, required: true },
  active: { type: Boolean, default: false },
  topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
});

export const Section = mongoose.model<ISection>("Section", SectionSchema);
