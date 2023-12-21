import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user {model-model} who owns the task
    taskName: String,
    dueDate: Date,
    completed: { type: Boolean, default: false },
});

const Task=mongoose.model('task',taskSchema);

export default Task;