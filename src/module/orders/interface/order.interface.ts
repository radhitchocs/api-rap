// src/module/orders/interface/order.interface.ts
import { Types } from 'mongoose';

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
  product_id: Types.ObjectId;
}
