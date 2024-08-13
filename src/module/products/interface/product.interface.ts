import { Document } from 'mongoose';

export interface ProductInterface extends Document {
  name: string;
  description: string;
  image: string;
  quantity: number;
  buy_price: number;
  sell_price: number;
  promo?: {
    is_promo: boolean;
    promo_price: number;
  };
  loyalty_points: number;
  created_at: Date;
  updated_at: Date;
}
