import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepo: Repository<Wish>,
  ) {}

  async create(dto: CreateWishlistDto, userId: number): Promise<Wishlist> {
    const items =
      dto.itemsId.length > 0
        ? await this.wishRepo.find({ where: { id: In(dto.itemsId) } })
        : [];
    const wishlist = this.wishlistRepo.create({
      name: dto.name,
      description: dto.description,
      image: dto.image,
      owner: { id: userId },
      items,
    });
    const saved = await this.wishlistRepo.save(wishlist);
    return this.findOne(saved.id);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepo.find({
      relations: ['owner', 'items', 'items.owner'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepo.findOne({
      where: { id },
      relations: ['owner', 'items', 'items.owner'],
    });
    if (!wishlist) throw new NotFoundException('Список подарков не найден');
    return wishlist;
  }

  async updateOne(
    id: number,
    userId: number,
    dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Нельзя редактировать чужие списки подарков',
      );
    }
    if (dto.itemsId) {
      wishlist.items =
        dto.itemsId.length > 0
          ? await this.wishRepo.find({ where: { id: In(dto.itemsId) } })
          : [];
    }
    if (dto.name !== undefined) wishlist.name = dto.name;
    if (dto.description !== undefined) wishlist.description = dto.description;
    if (dto.image !== undefined) wishlist.image = dto.image;
    await this.wishlistRepo.save(wishlist);
    return this.findOne(id);
  }

  async removeOne(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалять чужие списки подарков');
    }
    await this.wishlistRepo.delete(id);
    return wishlist;
  }
}
