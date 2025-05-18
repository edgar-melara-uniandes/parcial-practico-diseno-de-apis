import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { PlatoModule } from './plato/plato.module';

@Module({
  imports: [RestauranteModule, PlatoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
