import {
  Controller,
  Get,
  Post as PostMethod,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { UpdatePostDto } from './update-post.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 🔹 Obtener todos los posts (público)
  @Get()
  async findAll(@Request() req): Promise<PostEntity[]> {
    // obtenemos los query params
    const { city, category, type, q } = req.query;

    // los pasamos al servicio
    return this.postsService.getFilteredPosts({
      city,
      category,
      type,
      q,
    });
  }

  // 🔹 Obtener posts del usuario autenticado (usuario o admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('my')
  @Roles('usuario', 'admin')
  async findMyPosts(@Request() req): Promise<PostEntity[]> {
    return this.postsService.getPostsByUserId(req.user.id);
  }

  // 🔹 Obtener posts de un usuario (público)
  @Get('user/:userId')
  async getByUser(@Param('userId') userId: number): Promise<PostEntity[]> {
    return this.postsService.getPostsByUserId(userId);
  }

  // 🔹 Obtener un post por slug (público)
  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return this.postsService.getPostBySlug(slug);
  }

  // 🔹 Incrementar visitas (público)
  @Patch(':slug/visits')
  async incrementVisits(@Param('slug') slug: string): Promise<PostEntity> {
    return this.postsService.incrementVisits(slug);
  }

  // 🔹 Incrementar likes (público)
  @Patch(':slug/likes')
  async incrementLikes(@Param('slug') slug: string): Promise<PostEntity> {
    return this.postsService.incrementLikes(slug);
  }

  // 🔹 Crear un post (usuario o admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @PostMethod()
  @Roles('usuario', 'admin')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const slug = req.body.slug;
          if (!slug) {
            return cb(
              new Error('El slug es requerido antes de subir imágenes'),
              '',
            );
          }

          const uploadPath = path.join(
            process.cwd(),
            'uploads/images/posts',
            slug,
          );

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Request() req,
  ): Promise<PostEntity> {
    const newPost = await this.postsService.createPost(
      { ...body },
      req.user.id,
    );

    if (files && files.length > 0) {
      for (const file of files) {
        // ✅ pasamos el slug también
        await this.postsService.addImageToPost(newPost.id, file, body.slug);
      }
    }

    return this.postsService.getPostById(newPost.id);
  }

  // 🔹 Actualizar un post (usuario dueño o admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  @Roles('usuario', 'admin')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const slug = req.body.slug;
          if (!slug) {
            return cb(
              new Error('El slug es requerido antes de subir imágenes'),
              '',
            );
          }

          const uploadPath = path.join(
            process.cwd(),
            'uploads/images/posts',
            slug,
          );

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UpdatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    return this.postsService.updateByUser(id, req.user, body, files);
  }

  // 🔹 Eliminar un post (usuario dueño o admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles('usuario', 'admin')
  async remove(@Param('id') id: number, @Request() req): Promise<void> {
    return this.postsService.removeByUser(id, req.user);
  }

  // 🔹 Eliminar una imagen de un post (usuario dueño o admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('image/:imageId')
  @Roles('usuario', 'admin')
  async removeImage(@Param('imageId') imageId: number, @Request() req): Promise<{ message: string }> {
    await this.postsService.removeImageByUser(imageId, req.user);
    return { message: 'Imagen eliminada correctamente' };
  }

  // 🔹 Activar/desactivar un post (solo admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/toggle-active')
  @Roles('admin')
  async toggleActive(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.toggleActive(id);
  }
}
