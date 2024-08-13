import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';

import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleInterface } from '../interface/role.interface';
import { Role } from '../schema/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private rolesModel: PaginateModel<Role>,
  ) {}

  async get(): Promise<PaginateResult<RoleInterface>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };
    return this.rolesModel.paginate({}, options);
  }

  async getOne(id: Types.ObjectId): Promise<RoleInterface> {
    return this.rolesModel.findById(id);
  }

  async create(dto: CreateRoleDto): Promise<RoleInterface> {
    const newRole = await new this.rolesModel(dto).save();
    return newRole;
  }

  async update(id: Types.ObjectId, dto: CreateRoleDto): Promise<RoleInterface> {
    const role = await this.rolesModel.findById(id).lean();

    if (!role) {
      throw new Error('Role not found');
    }

    const updatedRole = await this.rolesModel.findOneAndUpdate(
      { _id: id },
      {
        $set: dto,
      },
      { new: true },
    );

    return updatedRole;
  }

  async delete(id: Types.ObjectId): Promise<RoleInterface> {
    return await this.rolesModel.findOneAndUpdate(
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
