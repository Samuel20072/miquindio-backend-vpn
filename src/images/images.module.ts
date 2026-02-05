import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './image.entity';
import { Post } from '../posts/post.entity'; // 👈 importa la entidad Post

@Module({
  imports: [
    TypeOrmModule.forFeature([Image, Post]), // 👈 agrega también Post
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
