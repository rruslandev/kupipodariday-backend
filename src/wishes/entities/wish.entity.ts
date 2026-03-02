import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { numericTransformer } from '../../common/numeric.transformer';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  price: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  raised: number;

  @Column({ type: 'int', default: 0 })
  copied: number;

  @Column({ type: 'varchar', length: 1024 })
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item, { cascade: true })
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
