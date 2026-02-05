import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './city.entity';
import { UpdateCityDto } from './update-city.dto';
import { CitiesDto } from './cities.Dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async findAll(): Promise<City[]> {
    return this.cityRepository.find();
  }

  async findOne(id: number): Promise<City | null> {
    return this.cityRepository.findOne({ where: { id } });
  }

  async create(
    data: CitiesDto,
    file: Express.Multer.File,
  ): Promise<City> {
    if (file) {
      data.image = `uploads/images/cities/${file.filename}`;
    }
    // Generar el slug a partir del nombre
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, '-') // Reemplaza espacios con -
      .replace(/[^\w\-]+/g, ''); // Elimina caracteres no válidos

    const newCity = { ...data, slug };
    const city = this.cityRepository.create(newCity);
    return this.cityRepository.save(city);
  }

  async update(
    id: number,
    data: UpdateCityDto,
    file: Express.Multer.File,
  ): Promise<City | null> {
    const city = await this.findOne(id);
    if (!city) {
      if (file) fs.unlinkSync(file.path);
      return null;
    }

    const oldImagePath = city.image;

    if (file) {
      data.image = `uploads/images/cities/${file.filename}`;
    }

    if (data.name && data.name !== city.name) {
      (data as any).slug = data.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
    }

    Object.assign(city, data);
    const updatedCity = await this.cityRepository.save(city);

    if (file && oldImagePath) {
      const fullOldPath = path.join(process.cwd(), oldImagePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlink(fullOldPath, (err) => {
          if (err) console.error('Error al eliminar la imagen antigua:', err);
        });
      }
    }

    return updatedCity;
  }

  async remove(id: number): Promise<boolean> {
    const city = await this.findOne(id);
    if (!city) return false;
    await this.cityRepository.delete(id);
    return true;
  }
}
