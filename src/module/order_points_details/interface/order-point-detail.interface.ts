import { Types } from 'mongoose';

export interface OrderPointDetailInterface {
  order_point_id: Types.ObjectId; // Sesuaikan nama dengan DTO
  product_id: Types.ObjectId;
  buy: number;
  qty: number;
  price: number;
  amount: number;
}
