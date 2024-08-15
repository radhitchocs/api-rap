import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
@Schema({
  collection: 'order_point_details',
  timestamps: true,
})
export class OrderPointDetailEntity extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  order_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  product_id: Types.ObjectId;

  @Prop({ required: true })
  points_earned: number;
}

export const OrderPointDetailSchema = SchemaFactory.createForClass(
  OrderPointDetailEntity,
).plugin(mongoosePaginate); // for pagination
