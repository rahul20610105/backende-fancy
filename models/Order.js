import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'productModel', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now },
});

const orderModel= mongoose.model('Order', orderSchema);
export default orderModel;