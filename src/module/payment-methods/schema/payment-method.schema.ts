import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { SoftDelete } from 'src/common/mongoose-delete/soft-delete';

@Schema({
  collection: 'payment_methods',
  timestamps: true,
})
export class PaymentMethodEntity extends Document {
  @Prop()
  name: string;
}

export const PaymentMethodSchema =
  SchemaFactory.createForClass(PaymentMethodEntity);

PaymentMethodSchema.plugin(mongoosePaginate);
PaymentMethodSchema.plugin(SoftDelete, {
  overrideMethods: true,
  deletedAt: true,
});
