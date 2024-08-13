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

import { CreateRoleDto } from '../dto/create-role.dto';
import { RolesService } from '../service/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ResponseMessage('Get all roles successfully.')
  async get() {
    const result = await this.rolesService.get();
    return result;
  }

  @Get(':id')
  @ResponseMessage('Get detail role successfully.')
  async getOne(@Param('id') id: Types.ObjectId) {
    const result = await this.rolesService.getOne(id);
    return result;
  }

  @Post()
  @ResponseMessage('Successfully create role!')
  async create(@Body() dto: CreateRoleDto) {
    const result = await this.rolesService.create(dto);
    return result;
  }

  @Patch(':id')
  @ResponseMessage('Successfully update role!')
  async update(@Param('id') id: Types.ObjectId, @Body() dto: CreateRoleDto) {
    const result = await this.rolesService.update(id, dto);
    return result;
  }

  @Delete(':id')
  @ResponseMessage('Successfully delete role!')
  async delete(@Param('id') id: Types.ObjectId) {
    const result = await this.rolesService.delete(id);
    return result;
  }
}
