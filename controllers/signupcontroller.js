import bcrypt from 'bcrypt';
import User from '../models/usermodel.js';

const SignupController = async (req, res) => {
  const { email, password, username } = req.body;
  console.log(email+password)

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email:email,
      password: hashedPassword, 
      Username:username,
    });

    await newUser.save();

    res.status(201).json({ message: 'User signed up successfully please continue with login' });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default SignupController;
