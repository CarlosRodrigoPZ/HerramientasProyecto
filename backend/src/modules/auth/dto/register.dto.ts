import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
