import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'stock-opnames',
  timestamps: true,
})
export class StockOpnameEntity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product_id: Types.ObjectId;

  @Prop()
  warehouse: string;

  @Prop()
  available_quantity: number;

  @Prop()
  difference: number;

  @Prop()
  price_value: number;

  @Prop()
  note?: string;

  @Prop()
  created_at: Date;

  @Prop()
  batch_code: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ default: true })
  is_active: boolean;
}

const StockOpnameSchema = SchemaFactory.createForClass(StockOpnameEntity);
StockOpnameSchema.plugin(mongoosePaginate);

export { StockOpnameSchema };
