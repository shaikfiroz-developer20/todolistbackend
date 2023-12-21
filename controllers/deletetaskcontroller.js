import Task from "../models/todolist.js";
import User from "../models/usermodel.js";

const DeleteTask = async (req, res) => {
  const { taskId } = req.body;

  try {
    // Check if the user is authenticated
    if (req.session && req.session.userId) {
      const userId = req.session.userId;

      // Fetch the user from the database using the user ID
      const userExist = await User.findById(userId);

      if (userExist) {
        // Delete the task for the user
        const result = await Task.deleteOne({ userId: userExist._id, _id: taskId });

        if (result.deletedCount === 1) {
          // Task successfully deleted
          return res.status(200).json({ message: 'Task deleted successfully' });
        } else {
          // Task not found or not deleted
          return res.status(404).json({ error: 'Task not found or could not be deleted' });
        }
      } else {
        return res.status(404).json({ error: 'User not found in the database' });
      }
    } else {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  } catch (error) {
    console.error('Error in DeleteTask:', error);
    // Handle the error and respond with an appropriate error message
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default DeleteTask;
