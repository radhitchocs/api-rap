import { Types } from 'mongoose';

export interface OrderPointInterface {
  _id?: Types.ObjectId;
  order_id: Types.ObjectId;
  customer_id: Types.ObjectId;
  user_id: Types.ObjectId; // Tambahkan user_id
  pay: number; // Tambahkan pay
  change?: number; // Tambahkan change
  note?: string; // Tambahkan note (opsional)
  total_points_earned: number;
  product_id: Types.ObjectId;
}
