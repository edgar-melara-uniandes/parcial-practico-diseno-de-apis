import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class RestauranteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  tipoCocina: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  paginaWeb: string;
}
