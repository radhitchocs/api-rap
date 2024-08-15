import { Types } from 'mongoose';

export interface OrderPointDetailInterface {
  order_id: Types.ObjectId;
  product_id: Types.ObjectId;
  points_earned: number;
}
