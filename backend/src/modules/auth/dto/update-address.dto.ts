import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  street?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  state?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  postalCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country?: string;
}
