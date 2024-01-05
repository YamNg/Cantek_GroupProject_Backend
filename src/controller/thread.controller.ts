import { Thread } from "../config/mongoose/models/thread.model.js";
import { Comment } from "../config/mongoose/models/comment.model.js";
import { NextFunction, Request, Response } from "express";
import { addThreadRequestValidator } from "./validator/thread-request.validator.js";
import { addCommentRequestValidator } from "./validator/comment-request.validator.js";
import mongoose from "mongoose";
import { ThreadConstants } from "../config/constant/thread.constant.js";
import { ThreadDto, ThreadListItemDto } from "./dto/thread.dto.js";
import { CommentConstants } from "../config/constant/comment.constant.js";
import { CustomError } from "../config/error/custom.error.js";
import { GenericResponseDto } from "./dto/generic-response.dto.js";

/* Threads related Operations */
export const addThread = async (req: Request, res: Response) => {
  const { error, value } = addThreadRequestValidator.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newThread = new Thread({
      topicId: value.topicId,
      title: value.title,
      userId: value.userId,
    });

    const { _id: savedThreadId } = await newThread.save({ session });

    const newComment = new Comment({
      threadId: savedThreadId,
      threadCommentNum: 1,
      content: value.content,
      userId: value.userId,
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
    await session.abortTransaction();
    res.status(400).send(err);
  }
};

export const getThreadDetailByPage = async (req: Request, res: Response) => {
  try {
    const commentPageNumber = parseInt(req.params.pageNumber) || 1;
    const threadId = req.params.threadId;

    // Approach 1 - using skip-limit
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
    res.status(400).send(err);
  }
};

export const getThreadsByTopic = async (req: Request, res: Response) => {
  try {
    const pageSize = ThreadConstants.pageSize;
    const lastId = req.query.lastId;
    const topicId = req.params.topicId;

    let query: any = { active: true, topicId };
    if (lastId) query._id = { $lt: lastId };

    const threads = await Thread.find(query)
      .sort({
        _id: -1,
      })
      .limit(pageSize)
      .populate([
        { path: "content" },
        { path: "author", select: ["username"] },
      ]);

    res.status(200).send(
      new GenericResponseDto({
        isSuccess: true,
        body: threads.map((thread) => new ThreadListItemDto(thread)),
      })
    );
  } catch (err) {
    res.status(400).send(err);
  }
};

/* Comment related operations */
export const addCommentToThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = addCommentRequestValidator.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
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
      throw new Error("COMMENT_NOT_ADDED");
      // throw new CustomError("COMMENT_NOT_ADDED", 401);
    }

    const newComment = new Comment({
      threadId: threadId,
      threadCommentNum: updatedMetadataThread?.metadata.commentCount,
      content: value.content,
      userId: value.userId,
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
    console.log("reach catch");
    await session.abortTransaction();
    // res.status(400).send(err);
    next(err);
  }
};

export const addReplyCommentToThread = async (req: Request, res: Response) => {
  const { error, value } = addCommentRequestValidator.validate(req.body);
  if (error) {
    return res.status(400).send(error);
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
      throw new Error("COMMENT_NOT_ADDED");
    }

    const parentComment = await Comment.findById(commentId, {
      query: { active: true },
    });

    if (!parentComment) {
      throw new Error("PARENT_COMMENT_NOT_FOUND");
    }

    const newComment = new Comment({
      threadId: threadId,
      threadCommentNum: updatedMetadataThread?.metadata.commentCount,
      content: value.content,
      userId: value.userId,
      metadata: {
        ancestor: [...(parentComment?.metadata.ancestor ?? []), commentId],
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
    await session.abortTransaction();
    res.status(400).send(err);
  }
};
