import { Test, TestingModule } from '@nestjs/testing';
import { PlatoService } from './plato.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlatoEntity } from './plato.entity/plato.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const platoArray = [
  {
    id: 1,
    nombre: 'Plato 1',
    descripcion: 'Desc 1',
    precio: 10.5,
    categoria: 'entrada',
    restaurantes: [],
  },
  {
    id: 2,
    nombre: 'Plato 2',
    descripcion: 'Desc 2',
    precio: 20.0,
    categoria: 'plato fuerte',
    restaurantes: [],
  },
];

describe('PlatoService', () => {
  let service: PlatoService;
  let repo: Repository<PlatoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlatoService,
        {
          provide: getRepositoryToken(PlatoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(platoArray),
            findOne: jest
              .fn()
              .mockImplementation(({ where: { id } }) =>
                Promise.resolve(platoArray.find((p) => p.id === id) ?? null),
              ),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((plato) =>
                Promise.resolve({ id: 3, ...plato }),
              ),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<PlatoService>(PlatoService);
    repo = module.get<Repository<PlatoEntity>>(getRepositoryToken(PlatoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all platos', async () => {
    const result = await service.findAll();
    expect(result).toEqual(platoArray);
    expect(repo.find).toHaveBeenCalledWith({ relations: ['restaurantes'] });
  });

  it('findOne should return a plato by id', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(platoArray[0]);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['restaurantes'],
    });
  });

  it('findOne should throw NotFoundException if not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('create should save and return a new plato', async () => {
    const dto = {
      nombre: 'Nuevo',
      descripcion: 'Desc',
      precio: 15,
      categoria: 'postre',
    };
    const result = await service.create(dto);
    expect(result).toEqual({ id: 3, ...dto });
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('create should throw BadRequestException if categoria is invalid', async () => {
    const dto = {
      nombre: 'Nuevo',
      descripcion: 'Desc',
      precio: 15,
      categoria: 'invalid',
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('create should throw BadRequestException if precio is not positive', async () => {
    const dto = {
      nombre: 'Nuevo',
      descripcion: 'Desc',
      precio: -5,
      categoria: 'entrada',
    };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('create should throw BadRequestException if precio is missing', async () => {
    const dto = {
      nombre: 'Nuevo',
      descripcion: 'Desc',
      categoria: 'entrada',
    };
    await expect(service.create(dto as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('create should throw BadRequestException if categoria is missing', async () => {
    const dto = {
      nombre: 'Nuevo',
      descripcion: 'Desc',
      precio: 10,
    };
    await expect(service.create(dto as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('update should update and return the plato', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(platoArray[0]);
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(platoArray[0]);
    const dto = { nombre: 'Actualizado' };
    const result = await service.update(1, dto);
    expect(result).toEqual(platoArray[0]);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
  });

  it('update should throw NotFoundException if not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.update(999, { nombre: 'X' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update should throw BadRequestException if categoria is invalid', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(platoArray[0]);
    await expect(service.update(1, { categoria: 'invalid' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('update should throw BadRequestException if precio is not positive', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(platoArray[0]);
    await expect(service.update(1, { precio: 0 })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('delete should remove the plato', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(platoArray[0]);
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('delete should throw NotFoundException if not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
  });
});
