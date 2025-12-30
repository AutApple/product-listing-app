import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config.js';
import { ProductsModule } from './products/products.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { AttributesModule } from './attributes/attributes.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewsModule } from './reviews/reviews.module';
import { BootstrapModule } from './bootstrap/bootstrap-module.js';
import { CacheModule } from '@nestjs/cache-manager'
import { getReddisConfig } from './config/reddis.config.js';
import { ImagesModule } from './images/images.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService]
    }),
    CacheModule.registerAsync({
      isGlobal: true, 
      imports: [ConfigModule],
      useFactory: getReddisConfig,  
      inject: [ConfigService] 
    }),
    ScheduleModule.forRoot(),
    BootstrapModule,
    ProductsModule,
    ProductTypesModule,
    AttributesModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    WishlistModule,
    ReviewsModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
