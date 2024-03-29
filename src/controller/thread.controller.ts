import { Thread } from "../config/mongoose/models/thread.model.js";
import { Comment } from "../config/mongoose/models/comment.model.js";
import { NextFunction, Request, Response } from "express";
import { addThreadRequestValidator } from "./validator/thread-request.validator.js";
import { addCommentRequestValidator } from "./validator/comment-request.validator.js";
import mongoose from "mongoose";
import { ThreadConstants } from "../config/constant/thread.constant.js";
import {
  ThreadDto,
  ThreadListDto,
  ThreadListItemDto,
} from "./dto/thread.dto.js";
import { CommentConstants } from "../config/constant/comment.constant.js";
import { GenericResponseDto } from "./dto/generic-response.dto.js";
import { commentPageNumberValidator } from "./validator/comment-request.validator.js";
import { AppError } from "../config/error/app.error.js";
import {
  ParentCommentNotFound,
  ThreadNotFound,
  TopicNotFound,
} from "../config/constant/app.error.contant.js";
import { TopicDto } from "./dto/topic.dto.js";
import { Topic } from "../config/mongoose/models/topic.model.js";

/* Threads related Operations */
export const addThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();

  try {
    const { error, value } = addThreadRequestValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) throw error;

    session.startTransaction();

    const newThread = new Thread({
      topicId: value.topicId,
      title: value.title,
      userId: req.user.userId,
    });

    const { _id: savedThreadId } = await newThread.save({ session });

    const newComment = new Comment({
      threadId: savedThreadId,
      threadCommentNum: 1,
      content: value.content,
      userId: req.user.userId,
    });

    const { _id: savedCommentId } = await newComment.save({ session });

    await Thread.findOneAndUpdate(
      { _id: savedThreadId },
      { $push: { comments: savedCommentId } },
      { new: true, session }
    );

    await session.commitTransaction();

    res.status(201).send(
      new GenericResponseDto({
        isSuccess: true,
        body: { _id: savedThreadId },
      })
    );
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    next(err);
  } finally {
    await session.endSession();
  }
};

export const getThreadDetailByPage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = commentPageNumberValidator.validate({
      pageNumber: req.params.pageNumber,
    });
    if (error) throw error;

    const { threadId, pageNumber } = req.params;
    const commentPageNumber = pageNumber ? Number(pageNumber) : 1;

    // Using skip-limit
    const skip = (commentPageNumber - 1) * CommentConstants.pageSize;
    const limit = CommentConstants.pageSize;

    const thread = await Thread.findById({ _id: threadId }).populate([
      {
        path: "comments",
        options: { skip: skip, limit: limit },
        populate: {
          path: "author",
          select: ["username"],
        },
      },
    ]);

    res.status(200).send(
      new GenericResponseDto({
        isSuccess: true,
        body: new ThreadDto(thread),
      })
    );
  } catch (err) {
    next(err);
  }
};

export const getLatestThreads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageSize = ThreadConstants.pageSize;
    const lastId = req.query.lastId;

    let query: any = { active: true };
    if (lastId) query._id = { $lt: lastId };

    const threads = await Thread.find(query)
      .sort({
        _id: -1,
      })
      .limit(pageSize)
      .populate([
        { path: "content" },
        { path: "author", select: ["username"] },
        { path: "topic" },
      ]);

    const body: ThreadListDto = {
      threads: threads.map((thread) => new ThreadListItemDto(thread)),
    };

    res.status(200).send(
      new GenericResponseDto({
        isSuccess: true,
        body,
      })
    );
  } catch (err) {
    next(err);
  }
};

export const getThreadsByTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageSize = ThreadConstants.pageSize;
    const lastId = req.query.lastId;
    const topicId = req.params.topicId;

    let query: any = { active: true, topicId };
    if (lastId) query._id = { $lt: lastId };

    const topic = await Topic.findOne({ _id: topicId, active: true });
    if (!topic) throw new AppError(TopicNotFound);

    const threads = await Thread.find(query)
      .sort({
        _id: -1,
      })
      .limit(pageSize)
      .populate([
        { path: "content" },
        { path: "author", select: ["username"] },
      ]);

    const body: ThreadListDto = {
      topic: new TopicDto(topic),
      threads: threads.map((thread) => new ThreadListItemDto(thread)),
    };

    res.status(200).send(
      new GenericResponseDto({
        isSuccess: true,
        body,
      })
    );
  } catch (err) {
    next(err);
  }
};

/* Comment related operations */
export const addCommentToThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error, value } = addCommentRequestValidator.validate(req.body);
    if (error) throw error;

    const threadId = req.params.threadId;
    const updatedMetadataThread = await Thread.findByIdAndUpdate(
      threadId,
      { $inc: { "metadata.commentCount": 1 } },
      {
        new: true,
        session,
        query: {
          "metadata.commentCount": { $lt: ThreadConstants.commentCountLimit },
          active: true,
        },
      }
    );

    if (!updatedMetadataThread) {
      throw new AppError(ThreadNotFound);
    }

    const newComment = new Comment({
      threadId: threadId,
      threadCommentNum: updatedMetadataThread?.metadata.commentCount,
      content: value.content,
      userId: req.user.userId,
    });

    const { _id: savedCommentId } = await newComment.save({ session });

    await Thread.findOneAndUpdate(
      { _id: threadId },
      { $push: { comments: savedCommentId } },
      { new: true, session }
    );

    await session.commitTransaction();

    res.status(201).send(
      new GenericResponseDto({
        isSuccess: true,
        body: {
          _id: savedCommentId,
        },
      })
    );
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    next(err);
  } finally {
    await session.endSession();
  }
};

export const addReplyCommentToThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = addCommentRequestValidator.validate(req.body);
  if (error) {
    throw error;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const threadId = req.params.threadId;
    const commentId = req.params.commentId;
    const updatedMetadataThread = await Thread.findByIdAndUpdate(
      threadId,
      { $inc: { "metadata.commentCount": 1 } },
      {
        new: true,
        session,
        query: {
          "metadata.commentCount": { $lt: ThreadConstants.commentCountLimit },
          active: true,
        },
      }
    );

    if (!updatedMetadataThread) {
      throw new AppError(ThreadNotFound);
    }

    const parentComment = await Comment.findOne({
      _id: commentId,
      active: true,
    });

    if (!parentComment) {
      throw new AppError(ParentCommentNotFound);
    }

    const newComment = new Comment({
      threadId: threadId,
      threadCommentNum: updatedMetadataThread?.metadata.commentCount,
      content: value.content,
      userId: req.user.userId,
      metadata: {
        ancestor: [commentId, ...(parentComment?.metadata.ancestor ?? [])],
      },
    });

    const { _id: savedCommentId } = await newComment.save({ session });

    await Comment.findOneAndUpdate(
      { _id: commentId },
      { $push: { "metadata.children": savedCommentId } },
      { new: true, session }
    );

    await Thread.findOneAndUpdate(
      { _id: threadId },
      { $push: { comments: savedCommentId } },
      { new: true, session }
    );

    await session.commitTransaction();

    res.status(201).send(
      new GenericResponseDto({
        isSuccess: true,
        body: {
          _id: savedCommentId,
        },
      })
    );
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    next(err);
  } finally {
    await session.endSession();
  }
};
