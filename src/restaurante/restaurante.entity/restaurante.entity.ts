import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PlatoEntity } from '../../plato/plato.entity/plato.entity';

@Entity()
export class RestauranteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  tipoCocina: string;

  @Column()
  paginaWeb: string;

  @ManyToMany(() => PlatoEntity, (plato) => plato.restaurantes, {
    cascade: true,
  })
  @JoinTable()
  platos: PlatoEntity[];
}
