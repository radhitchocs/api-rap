import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
@Schema({
  collection: 'permissions',
  timestamps: true,
})
export class PermissionEntity extends Document {
  @Prop()
  name: string;

  @Prop()
  label: string;

  @Prop()
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(PermissionEntity);

PermissionSchema.plugin(mongoosePaginate);
