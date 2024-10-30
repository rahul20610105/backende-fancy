import User from "../models/userModel.js";

const adminRoute = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ success: false, message: "Access denied. Admin only." });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error occurred while checking admin privileges." });
    }
};

export default adminRoute;
