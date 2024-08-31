import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'customers',
  timestamps: true,
})
export class CustomerEntity extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(CustomerEntity);
CustomerSchema.plugin(mongoosePaginate);
