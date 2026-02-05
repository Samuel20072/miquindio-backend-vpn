// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesDto } from './categories.Dto';
import { Category } from './category.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  findOne(id: number): Promise<Category | null> {
    return this.categoryRepo.findOne({ where: { id } });
  }

  async create(
    data: CategoriesDto,
    file: Express.Multer.File,
    userId: number,
  ): Promise<Category> {
    if (file) {
      data.image = `uploads/images/categories/${file.filename}`;
    }
    // Generar el slug a partir del nombre
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, '-') // Reemplaza espacios con -
      .replace(/[^\w\-]+/g, ''); // Elimina caracteres no válidos

    const newCategory = { ...data, slug, user: { id: userId } };
    const category = this.categoryRepo.create(newCategory);
    return this.categoryRepo.save(category);
  }

  async update(
    id: number,
    data: Partial<CategoriesDto>,
    file: Express.Multer.File,
  ): Promise<Category | null> {
    const category = await this.findOne(id);
    if (!category) {
      // Si se subió un archivo pero la categoría no existe, lo borramos para no dejar basura.
      if (file) fs.unlinkSync(file.path);
      return null;
    }

    const oldImagePath = category.image;

    if (file) {
      data.image = `uploads/images/categories/${file.filename}`;
    }

    // Si se está actualizando el nombre, también actualizamos el slug.
    if (data.name && data.name !== category.name) {
      (data as any).slug = data.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
    }

    // Asegurarse de que 'active' sea un booleano si viene como string
    if (data.active !== undefined) {
      // El ValidationPipe ya debería haberlo transformado, pero esto es una salvaguarda.
      // TypeORM manejará la conversión de boolean a 1/0 para MySQL.
      data.active = data.active === true || data.active === ('true' as any);
    }

    Object.assign(category, data);
    const updatedCategory = await this.categoryRepo.save(category);

    // Si la actualización fue exitosa y se subió una nueva imagen, borramos la antigua.
    if (file && oldImagePath) {
      const fullOldPath = path.join(process.cwd(), oldImagePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlink(fullOldPath, (err) => {
          if (err) console.error('Error al eliminar la imagen antigua:', err);
        });
      }
    }

    return updatedCategory;
  }

  async remove(id: number): Promise<boolean> {
    const category = await this.findOne(id);
    if (!category) return false;
    await this.categoryRepo.remove(category);
    return true;
  }
}
