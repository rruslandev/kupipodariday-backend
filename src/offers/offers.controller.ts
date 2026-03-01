import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from '../common/decorators';
import { toPublicProfile, sanitizeWish } from '../common/helpers';
import type { Offer } from './entities/offer.entity';

function sanitizeOffer(offer: Offer) {
  const { user, item, ...offerData } = offer;
  return {
    ...offerData,
    user: user ? toPublicProfile(user) : undefined,
    item: item ? sanitizeWish(item) : undefined,
  };
}

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@AuthUser() user: { id: number }, @Body() dto: CreateOfferDto) {
    const offer = await this.offersService.create(dto, user.id);
    return sanitizeOffer(offer);
  }

  @Get()
  async findAll() {
    const offers = await this.offersService.findAll();
    return offers.map(sanitizeOffer);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const offer = await this.offersService.findOne(id);
    return sanitizeOffer(offer);
  }
}
