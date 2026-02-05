import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsNumber()
  readonly postId?: number;
}
