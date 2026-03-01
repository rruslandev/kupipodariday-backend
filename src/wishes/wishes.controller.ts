import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser, Public } from '../common/decorators';
import { sanitizeWish } from '../common/helpers';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async create(@AuthUser() user: { id: number }, @Body() dto: CreateWishDto) {
    const wish = await this.wishesService.create(dto, user.id);
    return sanitizeWish(wish);
  }

  @Get()
  async findAll() {
    const wishes = await this.wishesService.findLast();
    return wishes.map(sanitizeWish);
  }

  @Public()
  @Get('last')
  async findLast() {
    const wishes = await this.wishesService.findLast();
    return wishes.map(sanitizeWish);
  }

  @Public()
  @Get('top')
  async findTop() {
    const wishes = await this.wishesService.findTop();
    return wishes.map(sanitizeWish);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: { id: number },
  ) {
    const wish = await this.wishesService.findOne(id);
    const result = sanitizeWish(wish);
    if (result.offers) {
      result.offers = result.offers.map((offer) => {
        if (
          offer.hidden &&
          user.id !== result.owner?.id &&
          user.id !== offer.user?.id
        ) {
          return { ...offer, amount: 0 };
        }
        return offer;
      });
    }
    return result;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: { id: number },
    @Body() dto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.updateOne(id, user.id, dto);
    return sanitizeWish(wish);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: { id: number },
  ) {
    return this.wishesService.removeOne(id, user.id);
  }

  @Post(':id/copy')
  async copy(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: { id: number },
  ) {
    const wish = await this.wishesService.copy(id, user.id);
    return sanitizeWish(wish);
  }
}
