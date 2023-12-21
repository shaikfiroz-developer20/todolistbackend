import User from "../models/usermodel.js";
import Task from "../models/todolist.js";

const Gettasks = async (req, res) => {
  try {
    if (req.session && req.session.userId) {
      const userId = req.session.userId;
      console.log(userId);
      // Fetch the user from the database using the user ID
      const userExist = await User.findById(userId);

      if (userExist) {
        // Find all tasks for the user
        const tasks = await Task.find({ userId: userExist._id });

        // Respond with the tasks
        return res.status(200).json({ tasks });
      } else {
        return res.status(404).json({ error: 'User not found in the database' });
      }
    } else {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  } catch (error) {
    console.error('Error in Gettasks:', error);
    // Handle the error and respond with an appropriate error message
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default Gettasks;
