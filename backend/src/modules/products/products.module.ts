import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from '../auth/admin.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, AdminGuard],
  exports: [ProductsService], // Por si se usa en otros módulos
})
export class ProductsModule {}
