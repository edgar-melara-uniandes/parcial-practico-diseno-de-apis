import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { RestaurantePlatoService } from './restaurante-plato.service';

@Controller('restaurants/:restaurantId/dishes')
export class RestaurantePlatoController {
  constructor(
    private readonly restaurantePlatoService: RestaurantePlatoService,
  ) {}

  @Post(':dishId')
  async addDishToRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    return await this.restaurantePlatoService.addDishToRestaurant(
      restaurantId,
      dishId,
    );
  }

  @Get()
  async findDishesFromRestaurant(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantePlatoService.findDishesFromRestaurant(
      restaurantId,
    );
  }

  @Get(':dishId')
  async findDishFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    return await this.restaurantePlatoService.findDishFromRestaurant(
      restaurantId,
      dishId,
    );
  }

  @Put()
  async updateDishesFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() dishes: any[],
  ) {
    return await this.restaurantePlatoService.updateDishesFromRestaurant(
      restaurantId,
      dishes,
    );
  }

  @Delete(':dishId')
  async deleteDishFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    return await this.restaurantePlatoService.deleteDishFromRestaurant(
      restaurantId,
      dishId,
    );
  }
}
