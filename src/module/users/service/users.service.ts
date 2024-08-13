import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { CreateUserDto } from '../dto/create-user.dto';
import { GetUserByCriteriaDto } from '../dto/get-user-by-criteria.dto';
import { UserInterface } from '../interface/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserInterface>) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    const secretKey = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      secretKey,
    );
    const newUser = await new this.userModel(createUserDto);
    return newUser.save();
  }

  async create(createUserDto: CreateUserDto): Promise<UserInterface> {
    const secretKey = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      secretKey,
    );
    const newUser = await new this.userModel(createUserDto);
    return newUser.save();
  }

  async getUserByEmail(email: string): Promise<UserInterface> {
    return await this.userModel.findOne({ email }).lean();
  }

  async findByUsername(username: string): Promise<UserInterface | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async getUserByCriteria(dto: GetUserByCriteriaDto): Promise<UserInterface> {
    return await this.userModel.findOne({ ...dto }).lean();
  }

  //   async updateUser(
  //     userId: string,
  //     updateUserDto: UpdateUserDto,
  //   ): Promise<UserInterface> {
  //     const existingUser = await this.userModel.findByIdAndUpdate(
  //       userId,
  //       updateUserDto,
  //       { new: true },
  //     );
  //     if (!existingUser) {
  //       throw new NotFoundException(`User #${userId} not found`);
  //     }
  //     return existingUser;
  //   }

  async getAllUsers(): Promise<UserInterface[]> {
    const userData = await this.userModel.find();
    if (!userData || userData.length == 0) {
      throw new NotFoundException('Users data not found!');
    }
    return userData;
  }

  async getUser(userId: string): Promise<UserInterface> {
    const existingUser = await this.userModel.findById(userId).exec();
    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return existingUser;
  }

  async deleteUser(userId: string): Promise<UserInterface> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return deletedUser;
  }
}
