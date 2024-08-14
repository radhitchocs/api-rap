import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'customers',
  timestamps: true,
})
export class CustomerEntity extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ default: 0 })
  loyalty_points: number;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(CustomerEntity);
CustomerSchema.plugin(mongoosePaginate);
