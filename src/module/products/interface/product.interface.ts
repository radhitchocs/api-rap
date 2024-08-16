import { Document, Types } from 'mongoose';

export interface ProductInterface extends Document {
  name: string;
  description: string;
  image: string;
  quantity: number;
  buy_price: number;
  sell_price: number;
  promo?: number;
  loyalty_points: number;
  is_promo?: boolean;
  is_active?: boolean;
  user_id?: Types.ObjectId;
}
