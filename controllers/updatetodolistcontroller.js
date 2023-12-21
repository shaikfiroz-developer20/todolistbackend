import bcrypt from 'bcrypt';
import Task from '../models/todolist.js';
import User from '../models/usermodel.js';

const UpdateTodo = async (req, res) => {
  const { taskId } = req.body; // Assuming you have a taskId in the request
  const { updatetodo, type } = req.body;

  try {
    // Check if the user is authenticated
    if (req.session && req.session.userId) {
      const userId = req.session.userId;

      // Fetch the user from the database using the user ID
      const existuser = await User.findById(userId);

      if (existuser) {
        // No need to compare password as the user is authenticated through the session

        const date = new Date();
        // Check if the task with taskId exists for the user
        const existingTask = await Task.findOne({ userId: userId, _id: taskId });

        if (existingTask) {
          // Update the existing task
          if (type === 'completion') {
            existingTask.completed = updatetodo;
            existingTask.dueDate = date;
          } else if (type === 'taskName') {
            existingTask.taskName = updatetodo;
            existingTask.dueDate = date;
          }

          await existingTask.save();

          return res.status(200).json({ message: 'Task updated successfully', taskid: existingTask._id });
        } else {
          return res.status(404).json({ message: 'Task not found for the user' });
        }
      } else {
        return res.status(401).json({ message: 'User not found in the database' });
      }
    } else {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default UpdateTodo;
