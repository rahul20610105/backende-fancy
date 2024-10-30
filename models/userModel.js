import mongoose from "mongoose"

// Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  username: { type: String, required: true }, // Keep required if name is necessary
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  isAdmin: { type: Boolean, default: false },  // Default to false for regular users
}, { minimize: false });

const User = mongoose.model('User', userSchema);
export default User;
