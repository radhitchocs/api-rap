import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'order_points',
  timestamps: true,
})
export class OrderPointEntity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order' })
  order_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  customer_id: Types.ObjectId;

  @Prop()
  total_points_earned: number;

  @Prop()
  created_at: Date;

  @Prop({ type: [{ product_id: Types.ObjectId, points_earned: Number }] })
  order_point_details: {
    product_id: Types.ObjectId;
    points_earned: number;
  }[];
}

export const OrderPointSchema = SchemaFactory.createForClass(OrderPointEntity);
