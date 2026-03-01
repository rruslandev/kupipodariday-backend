import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepo: Repository<Wish>,
  ) {}

  async create(dto: CreateWishDto, userId: number): Promise<Wish> {
    const wish = this.wishRepo.create({
      ...dto,
      raised: 0,
      copied: 0,
      owner: { id: userId },
    });
    const saved = await this.wishRepo.save(wish);
    return this.findOne(saved.id);
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepo.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner'],
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepo.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: ['owner'],
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepo.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) throw new NotFoundException('Подарок не найден');
    return wish;
  }

  async findMany(ids: number[]): Promise<Wish[]> {
    if (ids.length === 0) return [];
    return this.wishRepo.find({ where: { id: In(ids) } });
  }

  async updateOne(
    id: number,
    userId: number,
    dto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findOne(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя редактировать чужие подарки');
    }
    if (dto.price !== undefined && wish.offers?.length > 0) {
      throw new BadRequestException(
        'Нельзя менять стоимость, если уже есть желающие скинуться',
      );
    }
    await this.wishRepo.update(id, dto);
    return this.findOne(id);
  }

  async removeOne(id: number, userId: number): Promise<Wish> {
    const wish = await this.findOne(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалять чужие подарки');
    }
    if (wish.offers?.length > 0) {
      throw new BadRequestException(
        'Нельзя удалить подарок, на который уже скидываются',
      );
    }
    await this.wishRepo.delete(id);
    return wish;
  }

  async copy(id: number, userId: number): Promise<Wish> {
    const original = await this.findOne(id);
    const copy = this.wishRepo.create({
      name: original.name,
      link: original.link,
      image: original.image,
      price: original.price,
      description: original.description,
      owner: { id: userId },
      raised: 0,
      copied: 0,
    });
    original.copied += 1;
    await this.wishRepo.save(original);
    const saved = await this.wishRepo.save(copy);
    return this.findOne(saved.id);
  }

  async updateRaised(wishId: number, raised: number): Promise<void> {
    await this.wishRepo.update(wishId, { raised });
  }
}
