import Task from "../models/todolist.js";
import User from "../models/usermodel.js";

const Todolistofuser = async (req, res) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);  // Set the date to tomorrow
  const { tododata } = req.body;
  try {
    if (req.session &&  req.session.userId) {
      const userId = req.session.userId;
      const userExist = await User.findById(userId);

      if (userExist) {
        // Create a new task for the user with the manually assigned task ID
        const userTask = new Task({
          userId: userExist._id,
          taskName: tododata,
          dueDate: date,
          completed: false
        });

        // Save the task to the database
        await userTask.save();

        // Respond with a success message or any other appropriate response
        return res.status(201).json({ message: 'Task added successfully' });
      } else {
        return res.status(401).json({ error: 'User not found in the database' });
      }
    } else {
      return res.status(401).json({ error: 'User not authenticated' });
    }

  } catch (error) {
    console.error('Error in Todolistofuser:', error);
    // Handle the error and respond with an appropriate error message
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default Todolistofuser;
