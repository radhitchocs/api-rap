import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { SoftDelete } from 'src/common/mongoose-delete/soft-delete';

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
  stock: number;

  @Prop()
  buy_price: number;

  @Prop()
  sell_price: number;

  @Prop()
  discount?: number;

  @Prop({ default: false })
  is_promo?: boolean;

  @Prop({ default: true })
  is_active?: boolean;

  @Prop({ unique: true }) // Unique untuk memastikan setiap batch code berbeda
  batch_code: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntity);

ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(SoftDelete, { overrideMethods: true, deletedAt: true });
