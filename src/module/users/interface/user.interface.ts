import { Types } from 'mongoose';

export interface UserInterface {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  permissions: string[];
  password: string;
}
