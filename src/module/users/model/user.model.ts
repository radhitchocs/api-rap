import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';

import { UserInterface } from '../interface/user.interface';

@Exclude()
export class UserModel implements UserInterface {
  @Expose()
  _id: Types.ObjectId;
  @Expose()
  name: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  phoneNumber: string;
  @Expose()
  roles: string[];
  @Expose({ toPlainOnly: true })
  password: string;
  @Expose()
  permissions: string[];
}
