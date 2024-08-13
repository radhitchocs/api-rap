import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
);
