// authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: "Authorization token is required." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        next(); // Proceed if user is authenticated
    } catch (error) {
        console.error("Auth error:", error);
        res.status(403).json({ success: false, message: "Invalid token." });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
};

export { authMiddleware, adminMiddleware };
