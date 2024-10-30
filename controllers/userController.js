import express from 'express';
import User from '../models/userModel.js'; // Import your User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// User Registration
export const register = async (req, res) => {
    try {
        const { name, username, email, password, confirmPassword } = req.body;

        // Validate input fields
        if (!name || !username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check if username or email already exists
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: "Username or email already exists, try a different one" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            cartData: {}, // Initial empty cart
            isAdmin: false // Default to false for new users
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// User Login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input fields
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            });
        }

        // Check password validity
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            });
        }

        // Create JWT token payload
        const tokenData = {
            userId: user._id,
            isAdmin: user.isAdmin // Include admin status
        };

        // Generate JWT token
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        // Set the cookie with appropriate options
        res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });

        // Send success response with user details and the token
        return res.status(200).json({
            _id: user._id,
            username: user.username,
            name: user.name,
            isAdmin: user.isAdmin,
            token // Include the token in the response
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// User Logout
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
