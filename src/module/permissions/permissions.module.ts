import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PermissionsController } from './controller/permissions.controller';
import { PermissionEntity, PermissionSchema } from './schema/permission.schema';
import { PermissionsService } from './service/permissions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PermissionEntity.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
