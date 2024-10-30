import jwt from "jsonwebtoken";

// Middleware to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if decoding was successful
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token." });
    }

    // Attach the user ID to the request object
    req.id = decoded.userId;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error." }); // Return a 500 status on error
  }
};

export default isAuthenticated;