import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'order_points',
  timestamps: true,
})
export class OrderPointEntity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order' })
  order_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  customer_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' }) // Tambahkan user_id
  user_id: Types.ObjectId;

  @Prop()
  total: number; // Total biaya pesanan

  @Prop()
  pay: number; // Jumlah yang dibayar oleh pelanggan

  @Prop()
  change?: number; // Kembalian yang diterima pelanggan

  @Prop()
  note: string; // Catatan terkait pesanan

  @Prop()
  total_points_earned: number;

  @Prop()
  product_id: Types.ObjectId;
}

export const OrderPointSchema = SchemaFactory.createForClass(OrderPointEntity);

OrderPointSchema.plugin(mongoosePaginate);
