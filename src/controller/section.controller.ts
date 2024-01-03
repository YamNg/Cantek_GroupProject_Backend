import { Section } from "../config/mongoose/models/section.model.js";
import { Request, Response } from "express";

export const addSection = async (req: Request, res: Response) => {
  try {
    // create new Section
    const newSection = new Section(req.body);
    await newSection.save();
    res.status(201).send();
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getSections = async (req: Request, res: Response) => {
  try {
    const sections = await Section.find({ active: true }).populate("topics");
    res.status(200).send(sections);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const updateSection = async (req: Request, res: Response) => {
  const requestId = req.params.id;

  try {
    const section = await Section.findOneAndUpdate(
      { _id: requestId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).send(section);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const deactivateSection = async (req: Request, res: Response) => {
  const requestId = req.params.id;
  try {
    const section = await Section.findOneAndUpdate(
      { _id: requestId },
      { active: false },
      {
        new: true,
      }
    );
    res.status(200).send(section);
  } catch (err) {
    res.status(400).send(err);
  }
};
