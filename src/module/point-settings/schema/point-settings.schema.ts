import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'point_settings',
  timestamps: true,
})
export class PointSettingsEntity extends Document {
  @Prop({ required: true })
  point: number; // Ganti point_value dengan point

  @Prop({ required: true })
  every: string; // Ganti earning_criteria dengan every
}

export const PointSettingsSchema =
  SchemaFactory.createForClass(PointSettingsEntity);

PointSettingsSchema.plugin(mongoosePaginate);
