import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async saveImage(postId: number, url: string): Promise<Image> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post con id ${postId} no encontrado`);
    }
    const newImage = this.imageRepository.create({ url, post });
    return this.imageRepository.save(newImage);
  }

  async findOne(id: number): Promise<Image | null> {
    return this.imageRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.imageRepository.delete(id);
  }
}