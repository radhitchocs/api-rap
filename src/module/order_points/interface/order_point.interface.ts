import { Types } from 'mongoose';

export interface OrderPointInterface {
  order_id: Types.ObjectId;
  customer_id: Types.ObjectId;
  total_points_earned: number;
  created_at: Date;
  order_point_details: {
    product_id: Types.ObjectId;
    points_earned: number;
  }[];
}
