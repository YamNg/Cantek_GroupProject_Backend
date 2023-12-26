import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  parentComment: { type: String, default: null }
});

const Comment = mongoose.model('Comment', commentSchema);

export { Comment };
