import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CitiesDto {
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