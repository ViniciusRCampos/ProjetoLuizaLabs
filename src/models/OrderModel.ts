import mongoose from "mongoose";
import IOrder from "../interfaces/IOrder";

const ProductSchema = new mongoose.Schema({
  product_id: Number,
  value: Number,
}, { _id: false });

const OrderSchema = new mongoose.Schema<IOrder>({
  user_id: { type: Number, required: true },
  name: { type: String, required: true },
  order_id: { type: Number, required: true, unique: true },
  date: { type: String, required: true },
  total: { type: Number, required: true },
  products: [ProductSchema]
});

export default mongoose.model("OrderModel", OrderSchema);