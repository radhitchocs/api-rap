import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthConfig } from 'src/config/auth/jwt.auth.config';
import { Role, RoleSchema } from 'src/module/roles/schema/role.schema';
import { UsersModule } from 'src/module/users/users.module';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = new JwtAuthConfig(configService);
        return jwtConfig.createJwtOptions();
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthConfig],
  exports: [AuthService],
})
export class AuthModule {}
