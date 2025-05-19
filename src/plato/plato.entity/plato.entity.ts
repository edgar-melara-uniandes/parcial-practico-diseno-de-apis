import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { RestauranteEntity } from '../../restaurante/restaurante.entity/restaurante.entity';

@Entity()
export class PlatoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal')
  precio: number;

  @Column()
  categoria: string;

  @ManyToMany(() => RestauranteEntity, (restaurante) => restaurante.platos)
  restaurantes: RestauranteEntity[];
}
