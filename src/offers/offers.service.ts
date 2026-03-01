import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private readonly offerRepo: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, userId: number): Promise<Offer> {
    const wish = await this.wishesService.findOne(dto.itemId);

    if (wish.owner.id === userId) {
      throw new ForbiddenException('Нельзя скидываться на свой подарок');
    }
    if (wish.raised >= wish.price) {
      throw new BadRequestException('На этот подарок уже собраны деньги');
    }
    if (wish.raised + dto.amount > wish.price) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    const offer = this.offerRepo.create({
      amount: dto.amount,
      hidden: dto.hidden ?? false,
      user: { id: userId },
      item: { id: wish.id },
    });
    const savedOffer = await this.offerRepo.save(offer);

    const offers = await this.offerRepo.find({
      where: { item: { id: wish.id } },
    });
    const raised = offers.reduce((sum, o) => sum + Number(o.amount), 0);
    await this.wishesService.updateRaised(wish.id, raised);

    return this.findOne(savedOffer.id);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepo.find({ relations: ['item', 'item.owner', 'user'] });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepo.findOne({
      where: { id },
      relations: ['item', 'item.owner', 'user'],
    });
    if (!offer) throw new NotFoundException('Предложение не найдено');
    return offer;
  }
}
