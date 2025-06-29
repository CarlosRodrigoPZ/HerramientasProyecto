import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterProductsDto {
  @IsOptional()
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? [value] : value,
  )
  @IsArray()
  @IsString({ each: true })
  brand?: string[];

  @IsOptional()
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? [value] : value,
  )
  @IsArray()
  @IsString({ each: true })
  category?: string[];

  @IsOptional()
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? [value] : value,
  )
  @IsArray()
  @IsString({ each: true })
  material?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'reviewsCount';
}
