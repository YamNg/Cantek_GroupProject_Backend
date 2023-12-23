import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    pwHash: String,
    status: String
});

const Todo = mongoose.model("user", userSchema);

export {Todo};