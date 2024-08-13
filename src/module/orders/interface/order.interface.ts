// src/module/orders/interface/order.interface.ts
import { Types } from 'mongoose';

export interface OrderInterface {
  customerId: Types.ObjectId;
  userId: Types.ObjectId;
  paymentMethodId: Types.ObjectId;
  total: number;
  paymentStatus: string;
  createdAt: Date;
  orderDetails: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
    discount: number;
    amount: number;
  }[];
}
