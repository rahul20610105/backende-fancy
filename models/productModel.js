import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: [String], required: true }, // Corrected `array` to `Array`
  bestSeller: { type: Boolean, default: false },
  date: { type: Number, required: true }, // Corrected `number` to `Number`
});

// Correct model definition
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
