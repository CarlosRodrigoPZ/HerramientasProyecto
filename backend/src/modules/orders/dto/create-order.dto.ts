// src/modules/orders/dto/create-order.dto.ts
import {
  IsArray,
  ValidateNested,
  IsMongoId,
  IsNumber,
  Min,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsMongoId()
  product: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // New address fields
  @IsString()
  readonly street: string;

  @IsString()
  readonly city: string;

  @IsString()
  readonly state: string;

  @IsString()
  readonly postalCode: string;

  @IsString()
  readonly country: string;
}
