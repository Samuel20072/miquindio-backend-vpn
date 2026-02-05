import { PartialType } from '@nestjs/mapped-types';
import { CitiesDto } from './cities.Dto';

export class UpdateCityDto extends PartialType(CitiesDto) {}