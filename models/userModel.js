import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    isAdmin: { type: Boolean, default: false },
}, { minimize: false });

const User = mongoose.model('User', userSchema);
export default User;
