import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('filter')
  async filterProducts(@Query() filterDto: FilterProductsDto) {
    return this.productsService.filterAndSortProducts(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/disable')
  async updateProductDisableStatus(
    @Param('id') id: string,
    @Body('isDisabled') isDisabled: boolean,
  ) {
    return this.productsService.updateProductDisableStatus(id, isDisabled);
  }
}
