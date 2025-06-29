import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNumber()
  @IsOptional()
  reviews?: number;

  @IsString()
  @IsOptional()
  material?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string;
}
