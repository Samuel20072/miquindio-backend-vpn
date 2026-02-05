import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CategoriesDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  image: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean;
}
