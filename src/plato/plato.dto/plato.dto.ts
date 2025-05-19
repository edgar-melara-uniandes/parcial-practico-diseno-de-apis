import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class PlatoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @IsPositive()
  precio: number;
}
