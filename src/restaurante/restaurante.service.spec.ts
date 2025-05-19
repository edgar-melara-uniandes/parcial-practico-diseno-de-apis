import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteService } from './restaurante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity/restaurante.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const restauranteArray = [
  {
    id: 1,
    nombre: 'Restaurante 1',
    direccion: 'Calle 1',
    tipoCocina: 'Italiana',
    paginaWeb: 'http://rest1.com',
    platos: [],
  },
  {
    id: 2,
    nombre: 'Restaurante 2',
    direccion: 'Calle 2',
    tipoCocina: 'Japonesa',
    paginaWeb: 'http://rest2.com',
    platos: [],
  },
];

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repo: Repository<RestauranteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestauranteService,
        {
          provide: getRepositoryToken(RestauranteEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(restauranteArray),
            findOne: jest
              .fn()
              .mockImplementation(({ where: { id } }) =>
                Promise.resolve(restauranteArray.find((r) => r.id === id)),
              ),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((rest) =>
                Promise.resolve({ id: 3, ...rest }),
              ),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repo = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurantes', async () => {
    const result = await service.findAll();
    expect(result).toEqual(restauranteArray);
    expect(repo.find).toHaveBeenCalledWith({ relations: ['platos'] });
  });

  it('findOne should return a restaurante by id', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(restauranteArray[0]);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['platos'],
    });
  });

  it('findOne should throw NotFoundException if not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null); // <-- null en vez de undefined
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('create should save and return a new restaurante', async () => {
    const dto = {
      nombre: 'Nuevo',
      direccion: 'Calle X',
      tipoCocina: 'Mexicana',
      paginaWeb: 'http://nuevo.com',
    };
    const result = await service.create(dto);
    expect(result).toEqual({ id: 3, ...dto });
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('create should throw BadRequestException if tipoCocina is invalid', async () => {
    const dto = {
      nombre: 'Nuevo',
      direccion: 'Calle X',
      tipoCocina: 'Francesa', // inválido
      paginaWeb: 'http://nuevo.com',
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('update should update and return the restaurante', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(restauranteArray[0]);
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(restauranteArray[0]);
    const dto = { nombre: 'Actualizado' };
    // Corregido: findOne debe devolver null en vez de undefined
    const result = await service.update(1, dto);
    expect(result).toEqual(restauranteArray[0]);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
  });

  it('update should throw BadRequestException if tipoCocina is invalid', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(restauranteArray[0]);
    await expect(service.update(1, { tipoCocina: 'Francesa' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('update should throw NotFoundException if not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null); // <-- null en vez de undefined
    await expect(service.update(999, { nombre: 'X' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('delete should remove the restaurante', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(restauranteArray[0]);
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('delete should throw NotFoundException if not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null); // <-- null en vez de undefined
    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
  });
});
