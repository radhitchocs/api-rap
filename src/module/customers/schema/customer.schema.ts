import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'customers',
  timestamps: true,
})
export class CustomerEntity extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: 0 })
  point: number;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: Types.ObjectId, required: true })
  user_id: Types.ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(CustomerEntity);
CustomerSchema.plugin(mongoosePaginate);
