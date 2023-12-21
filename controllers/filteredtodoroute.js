import User from '../models/usermodel.js';
import Task from '../models/todolist.js';

const filteredTasksOnDate = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (req.session && req.session.userId) {
      const userId = req.session.userId;
      const { date } = req.query;

      // Fetch the user from the database using the user ID
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found in the database' });
      }

      try {
        // Retrieve tasks for the specific date and user ID
        const tasksOnDate = await Task.aggregate([
          {
            $match: {
              userId: existingUser._id,
              dueDate: {
                $gte: new Date(date + 'T00:00:00Z'), // Start of the requested date
                $lt: new Date(new Date(date + 'T00:00:00Z').setDate(new Date(date + 'T00:00:00Z').getDate() + 1)), // Start of the next day
              },
            },
          },
        ]);

        res.json(tasksOnDate);
      } catch (error) {
        console.error('Error retrieving tasks on date:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  } catch (error) {
    console.error('Error in filteredTasksOnDate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default filteredTasksOnDate;
