import { Thread } from "../config/mongoose/models/thread.model.js";
import { Comment } from "../config/mongoose/models/comment.model.js";
import { Request, Response } from "express";
import { addThreadRequestValidator } from "./validator/thread-request.validator.js";
import mongoose from "mongoose";

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

    res.status(201).send({ _id: savedThreadId });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).send(err);
  }
};

export const getThread = async (req: Request, res: Response) => {
  try {
    const threadId = req.params.threadId;
    const thread = await Thread.findOne({ _id: threadId });

    // populate the first page
    if (!thread) {
      return res.status(404).send();
    }

    res.status(200).send(thread);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getThreadsByTopic = async (req: Request, res: Response) => {
  try {
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 2;
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
        { path: "comments", options: { limit: 1 } },
        { path: "author", select: ["_id", "username"] },
      ]);

    res.status(200).send(threads);
  } catch (err) {
    res.status(400).send(err);
  }
};
