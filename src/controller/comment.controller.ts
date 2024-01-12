import { NextFunction, Request, Response } from "express";
import { Comment } from "../config/mongoose/models/comment.model.js";
import { PersistentCommentAnalytics } from "../config/mongoose/models/comment-analytics.event.model.js";
import { CommentAnalyticsConstants } from "../config/constant/comment.constant.js";
import mongoose, { ClientSession } from "mongoose";
import { GenericResponseDto } from "./dto/generic-response.dto.js";
import { AppError } from "../config/error/app.error.js";
import {
  CommentNotFound,
  CommentVoteExists,
} from "../config/constant/app.error.contant.js";
import { MongoServerError } from "mongodb";
import { CommentDto } from "./dto/comment.dto.js";

export const upvoteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  const userId = req.user.userId;

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
    next(err);
  } finally {
    await session.endSession();
  }
};

export const downvoteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  const userId = req.user.userId;

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
    next(err);
  } finally {
    await session.endSession();
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
    throw new AppError(CommentNotFound);
  }

  try {
    // as PersistentCommentAnalytics model have unique index, triggering save using same object will throw error
    const commentAnalytics = new PersistentCommentAnalytics({
      threadId: comment?.threadId,
      commentId,
      userId,
      eventType: CommentAnalyticsConstants.vote.eventType,
      eventValue,
    });
    await commentAnalytics.save({ session });
  } catch (error: any) {
    if (error instanceof MongoServerError) {
      if (error.code === 11000) throw new AppError(CommentVoteExists);
    }
    throw error;
  }

  await session.commitTransaction();

  return comment;
};

export const getCommentsByBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const batchIds: string[] = req.body.commentIds;

    const batchComments = await Comment.find({
      _id: { $in: batchIds },
      active: true,
    }).sort({
      _id: -1,
    });

    const batchArray = batchComments.map((comment) => new CommentDto(comment));

    res.status(200).send(
      new GenericResponseDto({
        isSuccess: true,
        body: batchArray,
      })
    );
  } catch (err) {
    next(err);
  }
};
