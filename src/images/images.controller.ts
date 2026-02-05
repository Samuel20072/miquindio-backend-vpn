import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Param,
  ParseIntPipe,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ImagesService } from './images.service';
import { Image } from './image.entity';

import * as fs from 'fs';
import sharp from 'sharp';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Delete(':id')
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    const image = await this.imagesService.findOne(id);
    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }

    // Eliminar el archivo físico del sistema
    const filePath = join(process.cwd(), image.url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Error al eliminar el archivo: ${filePath}`, error);
        // Opcional: podrías lanzar una excepción si la eliminación del archivo es crítica
        // throw new InternalServerErrorException('No se pudo eliminar el archivo de imagen');
      }
    }

    // Eliminar el registro de la base de datos
    await this.imagesService.delete(id);

    return { message: 'Imagen eliminada correctamente' };
  }

  @Post('upload/:postId')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const slug = req.body.slug;
          const uploadPath = join(
            process.cwd(),
            'uploads',
            'images',
            'posts',
            slug,
          );

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('postId', ParseIntPipe) postId: number,
    @Body('slug') slug: string,
  ) {
    const savedImages: Image[] = [];

    for (const file of files) {
      const compressedFilename = `compressed-${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}.webp`;

      const slugFolder = join(
        process.cwd(),
        'uploads',
        'images',
        'posts',
        slug,
      );

      if (!fs.existsSync(slugFolder)) {
        fs.mkdirSync(slugFolder, { recursive: true });
      }

      const outputPath = join(slugFolder, compressedFilename);

      await sharp(file.path).webp({ quality: 75 }).toFile(outputPath);

      fs.unlinkSync(file.path);

      // 🚀 Aquí NO se actualiza la anterior, se crea un registro NUEVO
      const img = await this.imagesService.saveImage(
        postId,
        `/uploads/images/posts/${slug}/${compressedFilename}`,
      );

      savedImages.push(img);
    }

    return {
      message: 'Imágenes agregadas correctamente',
      images: savedImages,
    };
  }
}
