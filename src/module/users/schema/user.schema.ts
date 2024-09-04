import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SoftDelete } from 'src/common/mongoose-delete/soft-delete';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;
  @Prop()
  username: string;
  @Prop()
  email: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  roles: string[];
  @Prop()
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(SoftDelete, { overrideMethods: true, deletedAt: true });
