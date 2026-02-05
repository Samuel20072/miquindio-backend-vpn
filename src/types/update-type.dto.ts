import { PartialType } from '@nestjs/mapped-types';
import { TypesDto } from '../categories/types.Dto';

export class UpdateTypeDto extends PartialType(TypesDto) {}