import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  ValidateIf,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePostDto {
  @IsNumber()
  @Type(() => Number)  // 👈 convierte "3" en 3
  city_id: number;

  @IsNumber()
  @Type(() => Number)
  category_id: number;

  @IsNumber()
  @Type(() => Number)
  type_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  visits?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  likes?: number;

  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => value !== null) // Solo valida como string si no es null
  phone?: string | null; // Permite null

  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => value !== null) // Solo valida como string si no es null
  address?: string | null; // Permite null

  @IsOptional()
  @IsBoolean()
  // La transformación de booleanos de string/number a boolean no debería afectar null
  // Si se envía null, pasará como null
  @Transform(({ value }) => {
    if (value === 'true' || value === 1 || value === '1') return true;
    if (value === 'false' || value === 0 || value === '0') return false;
    return value;
  })
  delivery?: boolean;

  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => value !== null) // Solo valida como string si no es null
  facebook?: string | null; // Permite null

  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => value !== null) // Solo valida como string si no es null
  instagram?: string | null; // Permite null

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rooms?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  baths?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  area?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  published?: Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
