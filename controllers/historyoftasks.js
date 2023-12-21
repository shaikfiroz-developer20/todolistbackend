import User from '../models/usermodel.js';
import Task from '../models/todolist.js';

const historyofuniquedatstasks = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (req.session && req.session.userId) {
      const userId = req.session.userId;

      // Fetch the user from the database using the user ID
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found in the database' });
      }

      try {
        const uniqueTasks = await Task.aggregate([
          {
            $match: { userId: existingUser._id }
          },
          {
            $addFields: {
              dueDate: {
                $dateToString: { format: '%Y-%m-%d', date: '$dueDate' }
              }
            }
          },
          {
            $group: {
              _id: '$dueDate',
              task: { $first: '$$ROOT' }
            }
          },
          {
            $replaceRoot: { newRoot: '$task' }
          }
        ]);

        res.json(uniqueTasks);
      } catch (error) {
        console.error('Error retrieving unique tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  } catch (error) {
    console.error('Error in historyofuniquedatstasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default historyofuniquedatstasks;
