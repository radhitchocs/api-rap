import { Types } from 'mongoose';

export interface StockOpnameInterface {
  product_id: Types.ObjectId;
  warehouse: string;
  available_quantity: number;
  difference: number;
  price_value: number;
  note?: string;
  created_at: Date;
  batch_code: string;
  user_id: Types.ObjectId;
  is_active?: boolean;
}
