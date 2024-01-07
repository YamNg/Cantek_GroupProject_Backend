import { Section } from "../config/mongoose/models/section.model.js";
import { NextFunction, Request, Response } from "express";
import { GenericResponseDto } from "./dto/generic-response.dto.js";
import { AppError } from "../config/error/app.error.js";
import { SectionNotFound } from "../config/constant/app.error.contant.js";

export const addSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // create new Section
    const newSection = new Section(req.body);
    await newSection.save();
    res.status(201).send(new GenericResponseDto({ isSuccess: true }));
  } catch (err) {
    next(err);
  }
};

export const getSections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sections = await Section.find({ active: true }).populate("topics");
    res
      .status(200)
      .send(new GenericResponseDto({ isSuccess: true, body: sections }));
  } catch (err) {
    next(err);
  }
};

export const updateSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.params.id;

  try {
    const section = await Section.findOneAndUpdate(
      { _id: requestId },
      req.body,
      {
        new: true,
      }
    );

    if (!section) {
      throw new AppError(SectionNotFound);
    }

    res
      .status(200)
      .send(new GenericResponseDto({ isSuccess: true, body: section }));
  } catch (err) {
    next(err);
  }
};

export const deactivateSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.params.id;
  try {
    const section = await Section.findOneAndUpdate(
      { _id: requestId },
      { active: false },
      {
        new: true,
      }
    );

    if (!section) {
      throw new AppError(SectionNotFound);
    }

    res
      .status(200)
      .send(new GenericResponseDto({ isSuccess: true, body: section }));
  } catch (err) {
    next(err);
  }
};
