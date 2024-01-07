import { Topic } from "../config/mongoose/models/topic.model.js";
import { Section } from "../config/mongoose/models/section.model.js";
import { NextFunction, Request, Response } from "express";
import { GenericResponseDto } from "./dto/generic-response.dto.js";
import { AppError } from "../config/error/app.error.js";
import { TopicNotFound } from "../config/constant/app.error.contant.js";

export const addTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // create new Topic
    const newTopic = new Topic(req.body);
    const result = await newTopic.save();
    await Section.findOneAndUpdate(
      { _id: result.sectionId },
      { $push: { topics: result._id } }
    );

    res.status(201).send(new GenericResponseDto({ isSuccess: true }));
  } catch (err) {
    next(err);
  }
};

export const getTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topics = await Topic.find({ active: true });
    res
      .status(200)
      .send(new GenericResponseDto({ isSuccess: true, body: topics }));
  } catch (err) {
    next(err);
  }
};

export const updateTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.params.id;

  try {
    const topic = await Topic.findOneAndUpdate({ _id: requestId }, req.body, {
      new: true,
    });

    if (!topic) {
      throw new AppError(TopicNotFound);
    }

    res
      .status(200)
      .send(new GenericResponseDto({ isSuccess: true, body: topic }));
  } catch (err) {
    next(err);
  }
};

export const deactivateTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.params.id;
  try {
    const topic = await Topic.findOneAndUpdate(
      { _id: requestId },
      { active: false },
      {
        new: true,
      }
    );

    if (!topic) {
      throw new AppError(TopicNotFound);
    }

    res
      .status(200)
      .send(new GenericResponseDto({ isSuccess: true, body: topic }));
  } catch (err) {
    next(err);
  }
};
