import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RestauranteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  tipoCocina: string;

  @Column()
  paginaWeb: string;
}
