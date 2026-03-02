import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { AuthUser } from '../common/decorators';

const opts = { excludeExtraneousValues: true } as const;

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@AuthUser() user: { id: number }, @Body() dto: CreateOfferDto) {
    const offer = await this.offersService.create(dto, user.id);
    return plainToInstance(OfferResponseDto, offer, opts);
  }

  @Get()
  async findAll() {
    const offers = await this.offersService.findAll();
    return plainToInstance(OfferResponseDto, offers, opts);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const offer = await this.offersService.findOne(id);
    return plainToInstance(OfferResponseDto, offer, opts);
  }
}
