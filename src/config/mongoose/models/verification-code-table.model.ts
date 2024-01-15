import mongoose, { Schema, Document, mongo } from "mongoose";

interface IVerificationCodeTable extends Document {
  user: mongoose.Types.ObjectId;
  code: string;
}

const VerificationCodeTableSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", require: true },
  code: { type: String, require: true},
});

export const VerificationCodeTable = mongoose.model<IVerificationCodeTable>("VerificationCodeTable", VerificationCodeTableSchema);