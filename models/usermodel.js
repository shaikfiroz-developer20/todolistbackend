import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, default: '' }, // default value for username
    phoneNumber: { type: Number, default: 0 }, // default value for phoneNumber
    name: { type: String, default: '' }, // default value for name
    profilePic: { type: Buffer, default: null }, // default value for profilePic
  });

  
const User = mongoose.model("User", userSchema);

export default User;
