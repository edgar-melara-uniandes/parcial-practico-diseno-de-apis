import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatoEntity } from './plato.entity/plato.entity';

const CATEGORIAS_VALIDAS = ['entrada', 'plato fuerte', 'postre', 'bebida'];

@Injectable()
export class PlatoService {
  constructor(
    @InjectRepository(PlatoEntity)
    private readonly platoRepository: Repository<PlatoEntity>,
  ) {}

  private validarCategoria(categoria: string) {
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      throw new BadRequestException(
        `Categoría inválida. Debe ser una de: ${CATEGORIAS_VALIDAS.join(', ')}`,
      );
    }
  }

  private validarPrecio(precio: number) {
    if (typeof precio !== 'number' || isNaN(precio) || precio <= 0) {
      throw new BadRequestException('El precio debe ser un número positivo');
    }
  }

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
    if (plato.categoria === undefined) {
      throw new BadRequestException('La categoría es obligatoria');
    }
    if (plato.precio === undefined) {
      throw new BadRequestException('El precio es obligatorio');
    }
    this.validarCategoria(plato.categoria);
    this.validarPrecio(plato.precio);
    const nuevoPlato = this.platoRepository.create(plato);
    return this.platoRepository.save(nuevoPlato);
  }

  async update(id: number, plato: Partial<PlatoEntity>): Promise<PlatoEntity> {
    const existe = await this.platoRepository.findOne({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Plato con id ${id} no encontrado`);
    }
    if (plato.categoria !== undefined) {
      this.validarCategoria(plato.categoria);
    }
    if (plato.precio !== undefined) {
      this.validarPrecio(plato.precio);
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
