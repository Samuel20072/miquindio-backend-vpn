import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TypesService } from './types.service';
import { Type } from './type.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TypesDto } from '../categories/types.Dto';
import { UpdateTypeDto } from './update-type.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  // ✅ Público - cualquier usuario puede ver
  @Get()
  async findAll(): Promise<Type[]> {
    return this.typesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Type> {
    const type = await this.typesService.findOne(id);
    if (!type) throw new NotFoundException('El tipo no existe');
    return type;
  }

  // ✅ Solo ADMIN puede crear
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads/images/types'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    body: TypesDto,
  ): Promise<Type> {
    return this.typesService.create(body, file);
  }

  // ✅ Solo ADMIN puede actualizar
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads/images/types'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    body: UpdateTypeDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Type | null> {
    const updated = await this.typesService.update(id, body, file);
    if (!updated) throw new NotFoundException('El tipo no existe');
    return updated;
  }

  // ✅ Solo ADMIN puede eliminar
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    const deleted = await this.typesService.remove(id);
    if (!deleted) throw new NotFoundException('El tipo no existe');
    return { message: 'Tipo eliminado' };
  }
}
