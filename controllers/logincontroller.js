import bcrypt from 'bcrypt';
import User from '../models/usermodel.js'; // Replace with your user model

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const isPasswordValid =bcrypt.compare(password, existingUser.password);

      if (isPasswordValid) {
        req.session.userId = existingUser._id;
        console.log("Login successful")
         res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error in Logging:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default loginController;
