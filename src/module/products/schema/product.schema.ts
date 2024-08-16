import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'products',
  timestamps: true,
})
export class ProductEntity extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  quantity: number;

  @Prop()
  buy_price: number;

  @Prop()
  sell_price: number;

  @Prop()
  discount?: number;

  @Prop()
  loyalty_points: number;

  @Prop({ default: false })
  is_promo?: boolean;

  @Prop({ default: true })
  is_active?: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntity);

ProductSchema.plugin(mongoosePaginate);
