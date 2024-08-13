import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SoftDelete } from 'src/common/mongoose-delete/soft-delete';

@Schema({
  collection: 'roles',
  timestamps: true,
})
export class Role extends Document {
  @Prop()
  name: string;

  @Prop()
  permissions: string[];

  @Prop({ default: false })
  isDefault: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.plugin(SoftDelete, { overrideMethods: true, deletedAt: true });
