import express from "express";
import { loginUser, registerUser, adminLogin } from "../controllers/userController.js";
import verifyToken from "../middleware/authMiddleware.js"; // Ensure this is the correct path
import adminRoute from "../middleware/adminMiddleware.js"; // Ensure this is the correct path

const userRoutes = express.Router();

// Route for user registration
userRoutes.post("/register", registerUser);

// Route for user login
userRoutes.post("/login", loginUser);

// Route for admin login (use admin authentication if needed)
userRoutes.post("/admin", verifyToken, adminRoute, adminLogin);

export default userRoutes;
