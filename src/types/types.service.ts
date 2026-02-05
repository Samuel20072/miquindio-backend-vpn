import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from './type.entity';
import { TypesDto } from '../categories/types.Dto';
import { UpdateTypeDto } from './update-type.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}

  async findAll(): Promise<Type[]> {
    return this.typeRepository.find();
  }

  async findOne(id: number): Promise<Type | null> {
    const type = await this.typeRepository.findOne({
      where: { id },
    });
    return type;
  }

  async create(data: TypesDto, file: Express.Multer.File): Promise<Type> {
    if (file) {
      data.image = `uploads/images/types/${file.filename}`;
    }
    // Generar el slug a partir del nombre
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, '-') // Reemplaza espacios con -
      .replace(/[^\w\-]+/g, ''); // Elimina caracteres no válidos

    const newType = { ...data, slug };
    const type = this.typeRepository.create(newType);
    return this.typeRepository.save(type);
  }

  async update(
    id: number,
    data: UpdateTypeDto,
    file: Express.Multer.File,
  ): Promise<Type | null> {
    const type = await this.findOne(id);
    if (!type) {
      if (file) fs.unlinkSync(file.path);
      return null;
    }

    const oldImagePath = type.image;

    if (file) {
      data.image = `uploads/images/types/${file.filename}`;
    }

    if (data.name && data.name !== type.name) {
      (data as any).slug = data.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
    }

    Object.assign(type, data);
    const updatedType = await this.typeRepository.save(type);

    if (file && oldImagePath) {
      const fullOldPath = path.join(process.cwd(), oldImagePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlink(fullOldPath, (err) => {
          if (err) console.error('Error al eliminar la imagen antigua:', err);
        });
      }
    }

    return updatedType;
  }

  async remove(id: number): Promise<boolean> {
    const type = await this.findOne(id);
    if (!type) return false;
    await this.typeRepository.delete(id);
    return true;
  }
}
