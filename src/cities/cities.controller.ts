import { CitiesService } from './cities.service';
import { City } from './city.entity';
import { CitiesDto } from './cities.Dto';
import { UpdateCityDto } from './update-city.dto'; // Importa el DTO de actualización
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  NotFoundException,
  ParseIntPipe,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  // ✅ Obtener todas las ciudades (público)
  @Get()
  async findAll(): Promise<City[]> {
    return await this.citiesService.findAll();
  }

  // ✅ Obtener una ciudad por id (público)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<City> {
    const city = await this.citiesService.findOne(id);
    if (!city) throw new NotFoundException('La ciudad no existe');
    return city;
  }

  // ✅ Crear ciudad (solo admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads/images/cities'),
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
    body: CitiesDto,
  ): Promise<City> {
    return this.citiesService.create(body, file);
  }

  // ✅ Actualizar ciudad (solo admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id') // También puedes usar @Patch([':id', '/:id']) para ser más explícito
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads/images/cities'),
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
    body: UpdateCityDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<City | null> {
    const updated = await this.citiesService.update(id, body, file);
    if (!updated) throw new NotFoundException('La ciudad no existe');
    return updated;
  }

  // ✅ Eliminar ciudad (solo admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.citiesService.remove(id);
    if (!deleted) throw new NotFoundException('La ciudad no existe');
    return { message: 'Ciudad eliminada' };
  }
}
