import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantePlatoService } from './restaurante-plato.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity/restaurante.entity';
import { PlatoEntity } from '../plato/plato.entity/plato.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const restaurante = {
  id: 1,
  nombre: 'Restaurante 1',
  direccion: 'Calle 1',
  tipoCocina: 'Italiana',
  paginaWeb: 'http://rest1.com',
  platos: [
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
  ],
};

const plato = {
  id: 3,
  nombre: 'Plato 3',
  descripcion: 'Desc 3',
  precio: 15.0,
  categoria: 'postre',
  restaurantes: [],
};

describe('RestaurantePlatoService', () => {
  let service: RestaurantePlatoService;
  let restauranteRepo: Repository<RestauranteEntity>;
  let platoRepo: Repository<PlatoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantePlatoService,
        {
          provide: getRepositoryToken(RestauranteEntity),
          useValue: {
            findOne: jest
              .fn()
              .mockImplementation(({ where: { id }, relations }) => {
                if (id === 1) return Promise.resolve({ ...restaurante });
                if (id === 99) return Promise.resolve(null);
                return Promise.resolve(null);
              }),
            save: jest.fn().mockImplementation((rest) => Promise.resolve(rest)),
          },
        },
        {
          provide: getRepositoryToken(PlatoEntity),
          useValue: {
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
              if (id === 3) return Promise.resolve({ ...plato });
              if (id === 99) return Promise.resolve(null);
              return Promise.resolve(null);
            }),
            findByIds: jest.fn().mockImplementation((ids: number[]) => {
              const all = [
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
                {
                  id: 3,
                  nombre: 'Plato 3',
                  descripcion: 'Desc 3',
                  precio: 15.0,
                  categoria: 'postre',
                  restaurantes: [],
                },
              ];
              // Devuelve solo los platos que existen en 'all' y están en 'ids'
              return Promise.resolve(all.filter((p) => ids.includes(p.id)));
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantePlatoService>(RestaurantePlatoService);
    restauranteRepo = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    platoRepo = module.get<Repository<PlatoEntity>>(
      getRepositoryToken(PlatoEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addDishToRestaurant should add a dish', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({
      ...restaurante,
      platos: [...restaurante.platos],
    });
    jest.spyOn(platoRepo, 'findOne').mockResolvedValueOnce({ ...plato });
    const result = await service.addDishToRestaurant(1, 3);
    expect(result.platos.find((p) => p.id === 3)).toBeDefined();
  });

  it('addDishToRestaurant should throw if restaurante not found', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.addDishToRestaurant(99, 3)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('addDishToRestaurant should throw if plato not found', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({
      ...restaurante,
      platos: [...restaurante.platos],
    });
    jest.spyOn(platoRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.addDishToRestaurant(1, 99)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findDishesFromRestaurant should return platos', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({
      ...restaurante,
      platos: [...restaurante.platos],
    });
    const result = await service.findDishesFromRestaurant(1);
    expect(result.length).toBe(2);
  });

  it('findDishesFromRestaurant should throw if restaurante not found', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findDishesFromRestaurant(99)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findDishFromRestaurant should return a plato', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({
      ...restaurante,
      platos: [...restaurante.platos],
    });
    const result = await service.findDishFromRestaurant(1, 1);
    expect(result.id).toBe(1);
  });

  it('findDishFromRestaurant should throw if restaurante not found', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findDishFromRestaurant(99, 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findDishFromRestaurant should throw if plato not associated', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({
      ...restaurante,
      platos: [...restaurante.platos],
    });
    await expect(service.findDishFromRestaurant(1, 99)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('updateDishesFromRestaurant should update platos', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({
      ...restaurante,
      platos: [...restaurante.platos],
    });
    jest.spyOn(platoRepo, 'findByIds').mockResolvedValueOnce([
      {
        id: 1,
        nombre: 'Plato 1',
        descripcion: 'Desc 1',
        precio: 10.5,
        categoria: 'entrada',
        restaurantes: [],
      },
      {
        id: 3,
        nombre: 'Plato 3',
        descripcion: 'Desc 3',
        precio: 15.0,
        categoria: 'postre',
        restaurantes: [],
      },
    ]);
    const result = await service.updateDishesFromRestaurant(1, [1, 3]);
    expect(result.platos.length).toBe(2);
    expect(result.platos.find((p) => p.id === 3)).toBeDefined();
  });

  it('updateDishesFromRestaurant should throw if restaurante not found', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(
      service.updateDishesFromRestaurant(99, [1, 3]),
    ).rejects.toThrow(NotFoundException);
  });

  it('updateDishesFromRestaurant should throw if any plato not found', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({
      ...restaurante,
      platos: [...restaurante.platos],
    });
    jest.spyOn(platoRepo, 'findByIds').mockResolvedValueOnce([
      {
        id: 1,
        nombre: 'Plato 1',
        descripcion: 'Desc 1',
        precio: 10.5,
        categoria: 'entrada',
        restaurantes: [],
      },
    ]);
    await expect(
      service.updateDishesFromRestaurant(1, [1, 99]),
    ).rejects.toThrow(NotFoundException);
  });

  it('deleteDishFromRestaurant should remove a plato', async () => {
    const restauranteWithPlatos = {
      ...restaurante,
      platos: [
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
      ],
    };
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({
      ...restauranteWithPlatos,
      platos: [...restauranteWithPlatos.platos],
    });
    await expect(
      service.deleteDishFromRestaurant(1, 2),
    ).resolves.toBeUndefined();
  });

  it('deleteDishFromRestaurant should throw if restaurante not found', async () => {
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.deleteDishFromRestaurant(99, 2)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deleteDishFromRestaurant should throw if plato not associated', async () => {
    const restauranteWithPlatos = {
      ...restaurante,
      platos: [
        {
          id: 1,
          nombre: 'Plato 1',
          descripcion: 'Desc 1',
          precio: 10.5,
          categoria: 'entrada',
          restaurantes: [],
        },
      ],
    };
    jest.spyOn(restauranteRepo, 'findOne').mockResolvedValueOnce({
      ...restauranteWithPlatos,
      platos: [...restauranteWithPlatos.platos],
    });
    await expect(service.deleteDishFromRestaurant(1, 99)).rejects.toThrow(
      NotFoundException,
    );
  });
});
