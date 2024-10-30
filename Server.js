import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectCloudinary from "./config/cloudinary.js";
import userRoutes from './routes/userRoutes.js';
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orders.js";

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // serverSelectionTimeoutMS: 5000, // Optional: Timeout after 5s
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Optional: handle connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.use("/api/user", userRoutes);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
