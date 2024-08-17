import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'order_point_details',
  timestamps: true,
})
export class OrderPointDetailEntity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'OrderPoint', required: true })
  order_point_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ required: true })
  buy: number;

  @Prop({ required: true })
  qty: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  amount: number;
}

export const OrderPointDetailSchema = SchemaFactory.createForClass(
  OrderPointDetailEntity,
).plugin(mongoosePaginate);
