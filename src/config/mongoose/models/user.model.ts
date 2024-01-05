import mongoose, { Schema, Document, mongo } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  salt: string;
  threads: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  savedThreads: mongoose.Types.ObjectId[];
  followedUsers: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
  isVerified: boolean;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    salt: { type: String, required: true },
    threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    savedThreads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
    followedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVerified: { type: Boolean, default: false},
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
