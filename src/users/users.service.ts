import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserDto } from './user.Dto';
import { Role } from '../roles/roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // <--- agregamos RoleRepository
  ) {}

  // Registrar usuario
  async register(userDto: UserDto) {
    const { name, email, password } = userDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Usuario ya registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Buscar el rol "usuario"
    const userRole = await this.roleRepository.findOne({
      where: { nombre: 'usuario' },
    });
    if (!userRole) {
      throw new BadRequestException(
        'Rol "usuario" no encontrado. Crea los roles primero.',
      );
    }

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      role: userRole, // <-- asignamos el rol automáticamente
    });

    await this.usersRepository.save(user);

    return {
      message: 'Usuario registrado con éxito',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.nombre, // <-- opcional, para devolver el rol
      },
    };
  }

  // Buscar todos
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['role'] }); // <-- incluir rol
  }

  // Buscar por ID
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
  //Email tiempo real
  async checkEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return !!user;
  }

  // Actualizar usuario
  async update(id: number, updateData: Partial<UserDto>): Promise<User> {
    const user = await this.findOne(id);

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  // Eliminar usuario
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { message: 'Usuario eliminado con éxito' };
  }
}
