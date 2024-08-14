import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  promo?: string; // Adjust the type based on your actual data

  @Prop()
  loyalty_points: number;
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntity);
