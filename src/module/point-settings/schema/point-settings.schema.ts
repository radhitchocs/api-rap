// src/module/point-settings/schema/point-settings.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'point_settings',
  timestamps: true,
})
export class PointSettingsEntity extends Document {
  @Prop({ required: true })
  point_value: number;

  @Prop({ required: true })
  earning_criteria: string;
}

export const PointSettingsSchema =
  SchemaFactory.createForClass(PointSettingsEntity);
