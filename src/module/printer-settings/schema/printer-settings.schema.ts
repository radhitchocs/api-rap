import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { SoftDelete } from 'src/common/mongoose-delete/soft-delete';

@Schema({
  collection: 'printer_settings',
  timestamps: true,
})
export class PrinterSettingsEntity extends Document {
  @Prop({ required: true })
  ip: string; // Alamat IP printer

  @Prop({ required: true })
  name: string; // Nama printer

  @Prop({ default: true })
  is_active: boolean; // Status printer
}

export const PrinterSettingsSchema = SchemaFactory.createForClass(
  PrinterSettingsEntity,
);

PrinterSettingsSchema.plugin(mongoosePaginate);
PrinterSettingsSchema.plugin(SoftDelete, {
  overrideMethods: true,
  deletedAt: true,
});
