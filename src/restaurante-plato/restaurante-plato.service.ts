import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity/plato.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantePlatoService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
    @InjectRepository(PlatoEntity)
    private readonly platoRepository: Repository<PlatoEntity>,
  ) {}

  async addDishToRestaurant(
    restauranteId: string,
    platoId: string,
  ): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) {
      throw new NotFoundException(
        `Restaurante con id ${restauranteId} no encontrado`,
      );
    }
    const plato = await this.platoRepository.findOne({
      where: { id: platoId },
    });
    if (!plato) {
      throw new NotFoundException(`Plato con id ${platoId} no encontrado`);
    }
    if (!restaurante.platos) restaurante.platos = [];
    if (!restaurante.platos.find((p) => p.id === plato.id)) {
      restaurante.platos.push(plato);
      await this.restauranteRepository.save(restaurante);
    }
    return restaurante;
  }

  async findDishesFromRestaurant(
    restauranteId: string,
  ): Promise<PlatoEntity[]> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) {
      throw new NotFoundException(
        `Restaurante con id ${restauranteId} no encontrado`,
      );
    }
    return restaurante.platos;
  }

  async findDishFromRestaurant(
    restauranteId: string,
    platoId: string,
  ): Promise<PlatoEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) {
      throw new NotFoundException(
        `Restaurante con id ${restauranteId} no encontrado`,
      );
    }
    const plato = restaurante.platos.find((p) => p.id === platoId);
    if (!plato) {
      throw new NotFoundException(
        `Plato con id ${platoId} no está asociado al restaurante`,
      );
    }
    return plato;
  }

  async updateDishesFromRestaurant(
    restauranteId: string,
    platosIds: string[],
  ): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) {
      throw new NotFoundException(
        `Restaurante con id ${restauranteId} no encontrado`,
      );
    }
    const platos = await this.platoRepository.findByIds(platosIds);
    if (platos.length !== platosIds.length) {
      throw new NotFoundException(`Uno o más platos no existen`);
    }
    restaurante.platos = platos;
    return this.restauranteRepository.save(restaurante);
  }

  async deleteDishFromRestaurant(
    restauranteId: string,
    platoId: string,
  ): Promise<void> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['platos'],
    });
    if (!restaurante) {
      throw new NotFoundException(
        `Restaurante con id ${restauranteId} no encontrado`,
      );
    }
    const platoIndex = restaurante.platos.findIndex((p) => p.id === platoId);
    if (platoIndex === -1) {
      throw new NotFoundException(
        `Plato con id ${platoId} no está asociado al restaurante`,
      );
    }
    restaurante.platos.splice(platoIndex, 1);
    await this.restauranteRepository.save(restaurante);
  }
}
