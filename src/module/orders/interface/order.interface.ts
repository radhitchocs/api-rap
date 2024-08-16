// src/module/orders/interface/order.interface.ts
import { Types } from 'mongoose';

export interface OrderDetail {
  product_id: Types.ObjectId;
  quantity: number;
  price: number;
  discount?: number;
  amount: number;
}

export interface Order extends Document {
  customer_id: Types.ObjectId;
  user_id: Types.ObjectId;
  payment_method_id: Types.ObjectId;
  proof_payment?: string;
  get_point?: number;
  total: number;
  pay: number;
  change?: number;
  note?: string;
  order_details: OrderDetail[];
}
