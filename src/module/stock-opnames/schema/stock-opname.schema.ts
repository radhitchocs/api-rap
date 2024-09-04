import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { SoftDelete } from 'src/common/mongoose-delete/soft-delete';

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
  available: number;

  @Prop()
  difference: number;

  @Prop()
  price_value: number;

  @Prop()
  note?: string;

  @Prop()
  batch_code: string;

  @Prop()
  user_id: Types.ObjectId;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: 0 })
  with_update: number; // Default value should be 0 if not provided
}

const StockOpnameSchema = SchemaFactory.createForClass(StockOpnameEntity);
StockOpnameSchema.plugin(mongoosePaginate);
StockOpnameSchema.plugin(SoftDelete, {
  overrideMethods: true,
  deletedAt: true,
});

export { StockOpnameSchema };
