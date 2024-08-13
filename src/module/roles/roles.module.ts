import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesController } from './controller/roles.controller';
import { Role, RoleSchema } from './schema/role.schema';
import { RolesService } from './service/roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
