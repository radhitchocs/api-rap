import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ResponseMessage } from 'src/decorator/response.decorator';

import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionsService } from '../service/permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ResponseMessage('Get all permissions successfully.')
  async get() {
    const result = await this.permissionsService.get();
    return result;
  }

  @Get(':id')
  @ResponseMessage('Get detail permission successfully.')
  async getOne(@Param('id') id: Types.ObjectId) {
    const result = await this.permissionsService.getOne(id);
    return result;
  }

  @Post()
  @ResponseMessage('Successfully create permission!')
  async create(@Body() dto: CreatePermissionDto) {
    const result = await this.permissionsService.create(dto);
    return result;
  }

  @Patch(':id')
  @ResponseMessage('Successfully update permission!')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() dto: CreatePermissionDto,
  ) {
    const result = await this.permissionsService.update(id, dto);
    return result;
  }

  @Delete(':id')
  @ResponseMessage('Successfully delete permission!')
  async delete(@Param('id') id: Types.ObjectId) {
    const result = await this.permissionsService.delete(id);
    return result;
  }
}
