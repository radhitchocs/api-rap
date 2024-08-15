import { Types } from 'mongoose';

export interface OrderDetailInterface {
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  discount: number;
}
