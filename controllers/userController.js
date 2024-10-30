import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token will expire in 1 hour
};

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            // Set token in the response headers (optional)
            res.setHeader("Authorization", `Bearer ${token}`);
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid password" });
        }
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.json({ success: false, message: "Error occurred. Try again." });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { username, email, password, name, isAdmin, adminKey } = req.body;

        // Check if the email already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists." });
        }

        // Validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email." });
        }
        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: "Please enter a strong password." });
        }

        // Verify admin key if registering as an admin
        if (isAdmin && adminKey !== process.env.ADMIN_KEY) {
            console.log("Provided admin key:", adminKey); // Debugging
            console.log("Expected admin key:", process.env.ADMIN_KEY); // Debugging
            return res.status(403).json({ success: false, message: "Invalid admin key." });
        }

        // Hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, name, isAdmin });
        const user = await newUser.save();
        const token = createToken(user._id);

        return res.json({ success: true, token });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.json({ success: false, message: "Error occurred. Please try again." });
    }
};

// Route for admin login 
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (!user.isAdmin) {
            return res.json({ success: false, message: "Access denied. Admin only." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid password" });
        }
    } catch (error) {
        console.error("Error in adminLogin:", error);
        return res.json({ success: false, message: "Error occurred. Try again." });
    }
};

export { loginUser, registerUser, adminLogin };
