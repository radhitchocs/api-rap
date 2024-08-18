import { Types } from 'mongoose';

export interface OrderDetailInterface {
  order_id: Types.ObjectId;
  product_id: Types.ObjectId;
  qty: number;
  price: number;
  disc: number;
  amount: number;
}
