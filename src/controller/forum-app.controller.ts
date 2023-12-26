import { Request, Response } from 'express';
import { Comment } from '../config/mongoose/models/comment.model.js';
import mongoose from 'mongoose';

export const addComment = async (req: Request, res: Response) => {
    try {
      console.log("Adding Comment");
      const comment = new Comment(req.body);
      await comment.save();
      res.status(201).send(comment);
    } catch (err) {
      // 400 bad request
      res.status(400).send(err);
    }
};

export const lookupCommentParent = async (req: Request, res: Response) => {
    const result = await Comment.aggregate([
      { $match: { 'id': req.params.commentId } },
      { 
        $graphLookup: {
          from: 'comments',
          startWith: '$parentComment',
          connectFromField: 'parentComment',
          connectToField: 'id',
          as: 'parentComments'
        }
      }
    ]);
    res.send(result);
  };