import { Topic } from "../config/mongoose/models/topic.model.js";
import { Section } from "../config/mongoose/models/section.model.js";
import { Request, Response } from "express";

export const addTopic = async (req: Request, res: Response) => {
  try {
    // create new Topic
    const newTopic = new Topic(req.body);
    const result = await newTopic.save();
    await Section.findOneAndUpdate(
      { _id: result.sectionId },
      { $push: { topics: result._id } }
    );

    res.status(201);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getTopics = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find({ active: true });
    res.status(200).send(topics);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const updateTopic = async (req: Request, res: Response) => {
  const requestId = req.params.id;

  try {
    const topic = await Topic.findOneAndUpdate({ _id: requestId }, req.body, {
      new: true,
    });
    res.status(200).send(topic);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const deactivateTopic = async (req: Request, res: Response) => {
  const requestId = req.params.id;
  try {
    const topic = await Topic.findOneAndUpdate(
      { _id: requestId },
      { active: false },
      {
        new: true,
      }
    );
    res.status(200).send(topic);
  } catch (err) {
    res.status(400).send(err);
  }
};
