import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { CitiesModule } from './cities/cities.module';
import { TypesModule } from './types/types.module';
import { ImagesModule } from './images/images.module';
import { RolesModule } from './roles/roles.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('database.url'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    CommentsModule,
    CategoriesModule,
    CitiesModule,
    TypesModule,
    ImagesModule,
    RolesModule,
  ],
})
export class AppModule {}
