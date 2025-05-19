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
import { PlatoService } from './plato.service';
import { PlatoEntity } from './plato.entity/plato.entity';
import { PlatoDto } from './plato.dto/plato.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('dishes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatoController {
  constructor(private readonly platoService: PlatoService) {}

  @Get()
  async findAll(): Promise<PlatoEntity[]> {
    return this.platoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PlatoEntity> {
    return this.platoService.findOne(id);
  }

  @Post()
  async create(@Body() platoDto: PlatoDto): Promise<PlatoEntity> {
    const plato = plainToInstance(PlatoEntity, platoDto);
    return this.platoService.create(plato);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() platoDto: PlatoDto,
  ): Promise<PlatoEntity> {
    const plato = plainToInstance(PlatoEntity, platoDto);
    return this.platoService.update(id, plato);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.platoService.delete(id);
  }
}
