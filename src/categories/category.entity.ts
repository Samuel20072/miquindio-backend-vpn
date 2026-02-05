import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  image?: string;
  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
