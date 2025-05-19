import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity/restaurante.entity';

const TIPOS_COCINA_VALIDOS = [
  'Italiana',
  'Japonesa',
  'Mexicana',
  'Colombiana',
  'India',
  'Internacional',
];

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
  ) {}

  private validarTipoCocina(tipoCocina: string) {
    if (!TIPOS_COCINA_VALIDOS.includes(tipoCocina)) {
      throw new BadRequestException(
        `Tipo de cocina inválido. Debe ser uno de: ${TIPOS_COCINA_VALIDOS.join(
          ', ',
        )}`,
      );
    }
  }

  async findAll(): Promise<RestauranteEntity[]> {
    return this.restauranteRepository.find({ relations: ['platos'] });
  }

  async findOne(id: string): Promise<RestauranteEntity> {
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
    if (!restaurante.tipoCocina) {
      throw new BadRequestException('El tipo de cocina es obligatorio');
    }
    this.validarTipoCocina(restaurante.tipoCocina);
    const nuevoRestaurante = this.restauranteRepository.create(restaurante);
    return this.restauranteRepository.save(nuevoRestaurante);
  }

  async update(
    id: string,
    restaurante: Partial<RestauranteEntity>,
  ): Promise<RestauranteEntity> {
    const existe = await this.restauranteRepository.findOne({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Restaurante con id ${id} no encontrado`);
    }
    if (restaurante.tipoCocina !== undefined) {
      this.validarTipoCocina(restaurante.tipoCocina);
    }
    await this.restauranteRepository.update(id, restaurante);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const existe = await this.restauranteRepository.findOne({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Restaurante con id ${id} no encontrado`);
    }
    await this.restauranteRepository.delete(id);
  }
}
