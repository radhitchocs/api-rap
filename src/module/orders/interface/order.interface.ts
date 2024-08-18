// src/module/orders/interface/order.interface.ts
import { Types } from 'mongoose';

export interface Order extends Document {
  customer: Types.ObjectId;
  user: Types.ObjectId;
  payment_method: Types.ObjectId;
  proof_payment?: string;
  total: number;
  pay: number;
  change?: number;
  note?: string;
  product: Types.ObjectId;
  qty: number;
}
