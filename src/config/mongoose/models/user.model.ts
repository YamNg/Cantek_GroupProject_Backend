import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  userNo: Number;
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
    userNo: {type: Number},
    username: { type: String, default: null },
    email: { type: String, required: true },
    password: {type: String},
    salt: { type: String },
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
