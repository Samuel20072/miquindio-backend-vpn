import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersInitService } from './Users.InitService';
import { User } from './user.entity';
import { RolesModule } from '../roles/roles.module'; // <-- IMPORTANTE

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule, // <-- aquí para poder inyectar RoleRepository
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersInitService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
