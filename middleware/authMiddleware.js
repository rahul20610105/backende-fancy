import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ success: false, message: "No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to authenticate token." });
        
        // Save user id for future use
        req.userId = decoded.id;
        next();
    });
};

export default verifyToken;
