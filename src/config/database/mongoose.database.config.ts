import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Injectable()
export class MongooseDatabaseConfig implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('MONGODB_URI'),
      connectionFactory: (connection) => {
        connection.plugin(mongoosePaginate);
        return connection;
      },
    };
  }
}
