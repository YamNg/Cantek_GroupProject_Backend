import { Request, Response } from "express";
import { Comment } from "../config/mongoose/models/comment.model.js";
import { PersistentCommentAnalytics } from "../config/mongoose/models/comment-analytics.event.model.js";
import { CommentAnalyticsConstants } from "../config/constant/comment.constant.js";
import mongoose, { ClientSession } from "mongoose";
import { GenericResponseDto } from "./dto/generic-response.dto.js";

export const upvoteComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const userId = req.body.userId;

  const session = await mongoose.startSession();

  try {
    const comment = await saveVote(
      commentId,
      CommentAnalyticsConstants.vote.eventValues.upvote,
      userId,
      session
    );
    res
      .status(201)
      .send(new GenericResponseDto({ isSuccess: true, body: comment }));
  } catch (err) {
    await session.abortTransaction();
    res.status(400).send(err);
  }
};

export const downvoteComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const userId = req.body.userId;

  const session = await mongoose.startSession();

  try {
    const comment = await saveVote(
      commentId,
      CommentAnalyticsConstants.vote.eventValues.downvote,
      userId,
      session
    );
    res
      .status(201)
      .send(new GenericResponseDto({ isSuccess: true, body: comment }));
  } catch (err) {
    await session.abortTransaction();
    res.status(400).send(err);
  }
};

const saveVote = async (
  commentId: string,
  eventValue: string,
  userId: string,
  session: ClientSession
) => {
  session.startTransaction();

  const metadataIncProperty = `metadata.${eventValue}`;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, active: true },
    { $inc: { [metadataIncProperty]: 1 } },
    {
      new: true,
      session,
    }
  );
  if (!comment) {
    throw new Error("COMMENT_NOT_FOUND");
  }

  // as PersistentCommentAnalytics model have unique index, triggering save using same object will throw error
  const commentAnalytics = new PersistentCommentAnalytics({
    threadId: comment?.threadId,
    commentId,
    userId,
    eventType: CommentAnalyticsConstants.vote.eventType,
    eventValue,
  });
  await commentAnalytics.save({ session });

  await session.commitTransaction();

  return comment;
};
