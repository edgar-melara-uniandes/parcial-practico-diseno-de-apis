import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity/plato.entity';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { RestaurantePlatoController } from './restaurante-plato.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity, PlatoEntity])],
  providers: [RestaurantePlatoService],
  exports: [RestaurantePlatoService],
  controllers: [RestaurantePlatoController],
})
export class RestaurantePlatoModule {}
