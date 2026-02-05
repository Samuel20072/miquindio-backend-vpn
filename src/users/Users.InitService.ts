import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/roles.entity';

@Injectable()
export class UsersInitService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const adminRole = await this.roleRepository.findOne({
      where: { nombre: 'admin' },
    });

    if (!adminRole) {
      console.log('No existe el rol admin. Créalo primero en RolesService.');
      return;
    }

    const adminExists = await this.userRepository.findOne({
      where: { role: { id: adminRole.id } },
      relations: ['role'],
    });


  }
}
