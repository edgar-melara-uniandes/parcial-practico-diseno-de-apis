import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { RestauranteEntity } from '../../restaurante/restaurante.entity/restaurante.entity';

@Entity()
export class PlatoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  categoria: string;

  @Column('float')
  precio: number;

  @ManyToMany(() => RestauranteEntity, (restaurante) => restaurante.platos)
  restaurantes: RestauranteEntity[];
}
