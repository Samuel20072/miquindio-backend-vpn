import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentDto } from './comment.Dto';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import * as leoProfanity from 'leo-profanity';

leoProfanity.add([
  'mierda',
  'culo',
  'culicagado',
  'gonorrea',
  'hijo de puta',
  'hijueputa',
  'chimba',
  'verga',
  'chingado',
  'cabrón',
  'malparido',
  'mamerto',
  'zoquete',
  'bobo',
  'baboso',
  'payaso',
  'tarado',
  'idiota',
  'imbécil',
  'bruto',
  'jueputa',
  'zorra',
  'caremonda',
  'cara de mondá',
  'mk',
  'hp',
  'marika',
  'perra',
  'metida',
  'zorras',
  'perras',
]);

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createComment(
    commentDto: CommentDto,
    userId: number,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({
      where: { id: commentDto.postId },
    });
    if (!post) throw new NotFoundException('Post no encontrado');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (!commentDto.content || !commentDto.content.trim()) {
      throw new BadRequestException('El comentario no puede estar vacío');
    }

    const originalContent = commentDto.content.trim();
    const normalizedContent = originalContent.toLowerCase();

    const content = leoProfanity.check(normalizedContent)
      ? leoProfanity.clean(originalContent) // limpia el original, respeta mayúsculas
      : originalContent;

    const comment = this.commentRepository.create({
      content,
      post,
      user,
    });

    return this.commentRepository.save(comment);
  }

  findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['user', 'post'] });
  }

  async findByPost(postId: number) {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    if (!comment)
      throw new NotFoundException(`Comentario con id ${id} no encontrado`);
    return comment;
  }

  async updateComment(
    id: number,
    userId: number,
    dto: CommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException('Comentario no encontrado');

    if (comment.user.id !== userId) {
      throw new ForbiddenException('Este comentario no te pertenece');
    }

    if (!dto.content || !dto.content.trim()) {
      throw new BadRequestException('El comentario no puede estar vacío');
    }

    const originalContent = dto.content.trim();
    const normalizedContent = originalContent.toLowerCase();

    comment.content = leoProfanity.check(normalizedContent)
      ? leoProfanity.clean(originalContent)
      : originalContent;

    return this.commentRepository.save(comment);
  }

  async removeComment(
    id: number,
    userId: number,
  ): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException('Comentario no encontrado');

    if (comment.user.id !== userId) {
      throw new ForbiddenException('Este comentario no te pertenece');
    }

    await this.commentRepository.remove(comment);

    return { message: 'Comentario eliminado con éxito' };
  }
}
