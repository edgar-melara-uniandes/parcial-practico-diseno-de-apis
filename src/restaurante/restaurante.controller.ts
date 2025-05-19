import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity/restaurante.entity';
import { RestauranteDto } from './restaurante.dto/restaurante.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @Get()
  async findAll(): Promise<RestauranteEntity[]> {
    return this.restauranteService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RestauranteEntity> {
    return this.restauranteService.findOne(id);
  }

  @Post()
  async create(
    @Body() restauranteDto: RestauranteDto,
  ): Promise<RestauranteEntity> {
    const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
    return this.restauranteService.create(restaurante);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() restauranteDto: RestauranteDto,
  ): Promise<RestauranteEntity> {
    const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
    return this.restauranteService.update(id, restaurante);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.restauranteService.delete(id);
  }
}
