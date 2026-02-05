// src/posts/posts.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';
import * as fs from 'fs'; // Importar módulo fs
import * as path from 'path'; // Importar módulo path
import { Image } from '../images/image.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 🔹 Crear un post con usuario asociado
  async createPost(data: CreatePostDto, userId: number): Promise<Post> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const post = this.postRepository.create({
      ...(data as Partial<Post>),
      user,
    });

    return this.postRepository.save(post);
  }

  // 🔹 Agregar imagen a un post (en carpeta del slug)
  async addImageToPost(
    postId: number, file: Express.Multer.File, slug: string,) {
    const sharp = (await import('sharp')).default;

    // 📂 Carpeta destino por slug
    const uploadDir = path.join(
      process.cwd(),
      'uploads',
      'images',
      'posts',
      slug,
    );
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 📌 Nombre único
    const compressedFilename = `compressed-${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}.webp`;
    const outputPath = path.join(uploadDir, compressedFilename);

    let quality = 85; // Calidad inicial
    const minQuality = 10; // Calidad mínima para no degradar demasiado
    const targetSizeInKb = 128;
    const targetSizeInBytes = targetSizeInKb * 1024;

    // Comprime la imagen una vez inicialmente
    await sharp(file.path).webp({ quality }).toFile(outputPath);

    // Bucle para reducir la calidad si el archivo sigue siendo muy grande
    while (fs.statSync(outputPath).size > targetSizeInBytes && quality > minQuality) {
      quality -= 10; // Reduce la calidad en 10
      await sharp(file.path).webp({ quality }).toFile(outputPath);
    }
    // 🧹 Eliminar archivo temporal
    fs.unlinkSync(file.path);

    // 📌 Guardamos la ruta relativa (para BD)
    const relativePath = `uploads/images/posts/${slug}/${compressedFilename}`;

    const image = this.imageRepository.create({
      url: relativePath,
      post: { id: postId },
    });

    return await this.imageRepository.save(image);
  }

  // 🔹 Obtener todos los posts
  // 🔹 Obtener posts con filtros opcionales
  async getFilteredPosts(filters: {
    city?: number;
    category?: number;
    type?: number;
    q?: string;
  }): Promise<Post[]> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.city', 'city')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.type', 'type')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.images', 'images');

    if (filters.city) {
      queryBuilder.andWhere('city.id = :cityId', { cityId: filters.city });
    }

    if (filters.category) {
      queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: filters.category,
      });
    }

    if (filters.type) {
      queryBuilder.andWhere('type.id = :typeId', { typeId: filters.type });
    }

    if (filters.q) {
      queryBuilder.andWhere(
        '(post.title LIKE :q OR post.description LIKE :q)',
        { q: `%${filters.q}%` },
      );
    }

    return queryBuilder.orderBy('post.id', 'DESC').getMany();
  }

  // 🔹 Obtener un post por ID
  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['images', 'user', 'city', 'category', 'type'],
    });
    if (!post) throw new NotFoundException(`Post con id ${id} no encontrado`);
    return post;
  }

  // 🔹 Actualizar un post (solo dueño)
  async updateByUser(
    id: number,
    user: User,
    data: UpdatePostDto,
    files?: Express.Multer.File[],
  ): Promise<Post> {
    const post = await this.getPostById(id);

    // ✅ 

    // 🔹 Manejo de relaciones
    if (data.city_id) {
      post.city = { id: data.city_id } as any;
      delete data.city_id;
    }
    if (data.category_id) {
      post.category = { id: data.category_id } as any;
      delete data.category_id;
    }
    if (data.type_id) {
      post.type = { id: data.type_id } as any;
      delete data.type_id;
    }

    // 🔹 Asignar el resto de campos
    Object.assign(post, data);

    const updatedPost = await this.postRepository.save(post);

    // 🔹 Agregar nuevas imágenes (sin borrar las anteriores)
    if (files && files.length > 0) {
      for (const file of files) {
        await this.addImageToPost(post.id, file, post.slug);
      }
    }

    return updatedPost;
  }

  // 🔹 Eliminar un post (solo dueño o admin)
  async removeByUser(id: number, user: User): Promise<void> {
    const post = await this.getPostById(id);

    // ✅ Eliminar archivos de imagen del sistema de archivos
    if (post.images && post.images.length > 0) {
      for (const image of post.images) {
        const imagePath = path.join(process.cwd(), image.url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Imagen eliminada del sistema de archivos: ${imagePath}`);
        }
      }
    }

    // Obtener la ruta del directorio del slug del post
    const slugDirectoryPath = path.join(process.cwd(), 'uploads', 'images', 'posts', post.slug);

    // Verificar si el directorio existe y está vacío, luego eliminarlo
    if (fs.existsSync(slugDirectoryPath)) {
      if (fs.readdirSync(slugDirectoryPath).length === 0) {
        fs.rmdirSync(slugDirectoryPath);
        console.log(`Directorio de slug vacío eliminado: ${slugDirectoryPath}`);
      }
    }
    if (post.images?.length > 0) {
      await this.imageRepository.remove(post.images);
    }

    await this.postRepository.remove(post);
  }

  // 🔹 Eliminar una imagen de un post (solo dueño o admin)
  async removeImageByUser(imageId: number, user: User): Promise<void> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      relations: ['post', 'post.user'],
    });

    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }

    const post = image.post;

    // Eliminar archivo físico
    const imagePath = path.join(process.cwd(), image.url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    console.log(`Imagen eliminada del sistema de archivos: ${imagePath}`);

    // Obtener la ruta del directorio padre de la imagen
    const directoryPath = path.dirname(imagePath);

    // Verificar si el directorio está vacío y eliminarlo
    if (fs.existsSync(directoryPath) && fs.readdirSync(directoryPath).length === 0) {
      fs.rmdirSync(directoryPath); // Elimina el directorio si está vacío
      console.log(`Directorio vacío eliminado: ${directoryPath}`);
    }

    // Eliminar registro de la base de datos
    await this.imageRepository.remove(image);
  }

  // 🔹 Obtener posts por usuario (público)
  async getPostsByUserId(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['images', 'city', 'category', 'type'],
    });
  }

  // 🔹 Obtener un post por slug
  async getPostBySlug(slug: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { slug },
      relations: ['images', 'user', 'city', 'category', 'type'],
    });
    if (!post)
      throw new NotFoundException(`Post con slug "${slug}" no encontrado`);
    return post;
  }

  // 🔹 Incrementar visitas
  async incrementVisits(slug: string): Promise<Post> {
    const post = await this.getPostBySlug(slug);
    post.visits = (post.visits || 0) + 1;
    return this.postRepository.save(post);
  }

  // 🔹 Incrementar likes
  async incrementLikes(slug: string): Promise<Post> {
    const post = await this.getPostBySlug(slug);
    post.likes = (post.likes || 0) + 1;
    return this.postRepository.save(post);
  }

  // 🔹 Alternar estado activo
  async toggleActive(id: number): Promise<Post> {
    const post = await this.getPostById(id);
    post.active = !post.active;
    return this.postRepository.save(post);
  }
}
