import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Product')
export class ProductSchema {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  // @Column()
  // public quantity: number;
  /* 
  public category: string;
  public image: string;
  public createdAt: Date;
  public updatedAt: Date; */
}
