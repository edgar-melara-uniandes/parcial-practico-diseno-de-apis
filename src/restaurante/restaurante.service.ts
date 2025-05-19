import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity/restaurante.entity';

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
  ) {}

  async findAll(): Promise<RestauranteEntity[]> {
    return this.restauranteRepository.find({ relations: ['platos'] });
  }

  async findOne(id: number): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id },
      relations: ['platos'],
    });
    if (!restaurante) {
      throw new NotFoundException(`Restaurante con id ${id} no encontrado`);
    }
    return restaurante;
  }

  async create(
    restaurante: Partial<RestauranteEntity>,
  ): Promise<RestauranteEntity> {
    const nuevoRestaurante = this.restauranteRepository.create(restaurante);
    return this.restauranteRepository.save(nuevoRestaurante);
  }

  async update(
    id: number,
    restaurante: Partial<RestauranteEntity>,
  ): Promise<RestauranteEntity> {
    const existe = await this.restauranteRepository.findOne({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Restaurante con id ${id} no encontrado`);
    }
    await this.restauranteRepository.update(id, restaurante);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const existe = await this.restauranteRepository.findOne({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Restaurante con id ${id} no encontrado`);
    }
    await this.restauranteRepository.delete(id);
  }
}
