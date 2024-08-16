import { Types } from 'mongoose';

export interface CustomerInterface {
  _id?: Types.ObjectId;
  name: string;
  address: string;
  phone: string;
  email: string;
  point: number;
  is_active: boolean;
  user_id: Types.ObjectId;
}
