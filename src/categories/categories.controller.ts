import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
  Request,
  UseGuards,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CategoriesDto } from './categories.Dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ✅ Obtener todas las categorías (público)
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  // ✅ Obtener una categoría por id (público)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    const category = await this.categoriesService.findOne(id);
    if (!category) throw new NotFoundException('La categoría no existe');
    return category;
  }

  // ✅ Crear categoría (solo admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads/images/categories'),
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
    @Body(
      new ValidationPipe({
        transform: true, // Transforma el payload a la instancia del DTO
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: CategoriesDto,
    @Request() req,
  ): Promise<Category> {
    return this.categoriesService.create(body, file, req.user.id);
  }

  // ✅ Actualizar categoría parcialmente (solo admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads/images/categories'),
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
    @Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    body: Partial<CategoriesDto>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updated = await this.categoriesService.update(id, body, file);
    if (!updated) throw new NotFoundException('La categoría no existe');
    return updated;
  }

  // ✅ Eliminar categoría (solo admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.categoriesService.remove(id);
    if (!deleted) throw new NotFoundException('La categoría no existe');
    return { message: 'Categoría eliminada' };
  }
}
