import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import { RoleEnum } from 'src/enum/role.enum';
import { RoleInterface } from 'src/module/roles/interface/role.interface';
import { Role } from 'src/module/roles/schema/role.schema';
import { UserModel } from 'src/module/users/model/user.model';
import { UserService } from 'src/module/users/service/users.service';
import { hasRoles } from 'src/util/role.util';

import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/response/login.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    private jwtService: JwtService,
    @InjectModel(Role.name) private roleModel: Model<RoleInterface>,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.getUserByCriteria({
      username: dto.username,
    });

    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new NotAcceptableException(`Invalid password!`);
    }
    user.permissions = await this.getPermissionsByRole(user.roles);

    if (!hasRoles(user.roles, [RoleEnum.ADMIN, RoleEnum.KASIR])) {
      throw new NotAcceptableException(`Access Permitted!`);
    }

    const payload = {
      username: user.username,
      sub: user._id,
      role: user.roles,
      permission: user.permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: plainToClass(UserModel, user),
    };
  }

  async getPermissionsByRole(roles: string[]): Promise<string[]> {
    const foundRoles = await this.roleModel
      .find({
        name: {
          $in: roles,
        },
      })
      .lean();

    return foundRoles.reduce((acc: string[], role) => {
      acc = acc.concat(role.permissions);
      return acc.filter((item) => !!item);
    }, []);
  }
}
