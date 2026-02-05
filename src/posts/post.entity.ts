import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { City } from '../cities/city.entity';
import { Type } from '../types/type.entity';
import { Image } from '../images/image.entity';
import { Comment } from '../comments/comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  city_id: number;

  @Column()
  category_id: number;

  @Column()
  type_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column({ default: 0 })
  visits: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'boolean', default: false })
  delivery: boolean;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  rooms: number;

  @Column({ nullable: true })
  baths: number;

  @Column({ nullable: true })
  area: number;

  @Column({ nullable: true })
  price: number;

  @Column({ type: 'date', nullable: true })
  published: Date;

  @Column('text', { nullable: true })
  location: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relaciones
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => City, (city) => city.posts)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Type, (type) => type.posts)
  @JoinColumn({ name: 'type_id' })
  type: Type;

  @OneToMany(() => Image, (image) => image.post, { cascade: true })
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
