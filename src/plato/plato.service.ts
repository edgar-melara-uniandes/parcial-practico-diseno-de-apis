import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatoEntity } from './plato.entity/plato.entity';

@Injectable()
export class PlatoService {
  constructor(
    @InjectRepository(PlatoEntity)
    private readonly platoRepository: Repository<PlatoEntity>,
  ) {}

  async findAll(): Promise<PlatoEntity[]> {
    return this.platoRepository.find({ relations: ['restaurantes'] });
  }

  async findOne(id: number): Promise<PlatoEntity> {
    const plato = await this.platoRepository.findOne({
      where: { id },
      relations: ['restaurantes'],
    });
    if (!plato) {
      throw new NotFoundException(`Plato con id ${id} no encontrado`);
    }
    return plato;
  }

  async create(plato: Partial<PlatoEntity>): Promise<PlatoEntity> {
    const nuevoPlato = this.platoRepository.create(plato);
    return this.platoRepository.save(nuevoPlato);
  }

  async update(id: number, plato: Partial<PlatoEntity>): Promise<PlatoEntity> {
    const existe = await this.platoRepository.findOne({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Plato con id ${id} no encontrado`);
    }
    await this.platoRepository.update(id, plato);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const existe = await this.platoRepository.findOne({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Plato con id ${id} no encontrado`);
    }
    await this.platoRepository.delete(id);
  }
}
