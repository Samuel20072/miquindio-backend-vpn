import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Req,
  Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './user.Dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { Request as ExpressRequest } from 'express';
import { error } from 'console';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: number;[key: string]: any }; // ajusta según tu payload del JWT
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // 🔹 Registro de usuario → Público
  @Post('register')
  async register(@Body() userDto: UserDto) {
    return this.usersService.register(userDto);
  }

  // 🔹 Obtener usuario actual desde token
  @UseGuards(AuthGuard('jwt'))
  @Get('auth/me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Req() req: AuthenticatedRequest) {
    return this.usersService.findOne(req.user.id);
  }

  // 🔹 Solo ADMIN puede listar todos los usuarios
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const exists = await this.usersService.checkEmail(email);
    return { exists };
  }

  // 🔹 Solo ADMIN puede ver un usuario específico
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDto: Partial<UserDto>,
    @Req() req: AuthenticatedRequest // Necesitamos el usuario logueado
  ) {
    const userLogueado = req.user;

    // 1. Si NO es admin, verificamos que el ID que intenta editar sea el SUYO
    // Nota: userLogueado.role puede venir como objeto o ID según tu JWT
    const isAdmin = userLogueado.role === 1 || userLogueado.role?.id === 1;

    if (!isAdmin && userLogueado.id !== id) {
      throw new error('No tienes permiso para editar otros perfiles');
    }


    // 2. Si es admin o es su propio perfil, procedemos
    return this.usersService.update(id, userDto);
  }

  // 🔹 Solo ADMIN puede eliminar usuarios
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
