import { Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity/plato.entity';
import { RestauranteController } from './restaurante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity])],
  providers: [RestauranteService],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
