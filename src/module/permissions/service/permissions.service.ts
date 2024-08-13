import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';

import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionInterface } from '../interface/permission.interface';
import { PermissionEntity } from '../schema/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(PermissionEntity.name)
    private permissionsModel: PaginateModel<PermissionEntity>,
  ) {}

  async get(): Promise<PaginateResult<PermissionInterface>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };
    return this.permissionsModel.paginate({}, options);
  }

  async getOne(id: Types.ObjectId): Promise<PermissionInterface> {
    return this.permissionsModel.findById(id);
  }

  async create(dto: CreatePermissionDto): Promise<PermissionInterface> {
    const newPermission = await new this.permissionsModel(dto).save();
    return newPermission;
  }

  async update(
    id: Types.ObjectId,
    dto: CreatePermissionDto,
  ): Promise<PermissionInterface> {
    const permission = await this.permissionsModel.findById(id).lean();

    if (!permission) {
      throw new Error('Permission not found');
    }

    const updatedPermission = await this.permissionsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: dto,
      },
      { new: true },
    );

    return updatedPermission;
  }

  async delete(id: Types.ObjectId): Promise<PermissionInterface> {
    return await this.permissionsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          deleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );
  }
}
