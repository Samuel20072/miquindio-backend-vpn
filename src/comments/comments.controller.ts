import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './comment.Dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('usuario', 'admin')
  @Post()
  create(@Body() commentDto: CommentDto, @Request() req) {
    const userId = req.user.id; // 👈 cambio aquí
    return this.commentsService.createComment(commentDto, userId);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }
  @Get('post/:postId')
  findByPost(@Param('postId') postId: number) {
    return this.commentsService.findByPost(postId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('usuario', 'admin')
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CommentDto, @Request() req) {
    const userId = req.user.id;
    return this.commentsService.updateComment(id, userId, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('usuario', 'admin')
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    const userId = req.user.id; // 👈 cambio aquí
    return this.commentsService.removeComment(id, userId);
  }
}
