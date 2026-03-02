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
import { plainToInstance } from 'class-transformer';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishResponseDto } from './dto/wish-response.dto';
import { AuthUser, Public } from '../common/decorators';

const opts = { excludeExtraneousValues: true } as const;

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async create(@AuthUser() user: { id: number }, @Body() dto: CreateWishDto) {
    const wish = await this.wishesService.create(dto, user.id);
    return plainToInstance(WishResponseDto, wish, opts);
  }

  @Get()
  async findAll() {
    const wishes = await this.wishesService.findLast();
    return plainToInstance(WishResponseDto, wishes, opts);
  }

  @Public()
  @Get('last')
  async findLast() {
    const wishes = await this.wishesService.findLast();
    return plainToInstance(WishResponseDto, wishes, opts);
  }

  @Public()
  @Get('top')
  async findTop() {
    const wishes = await this.wishesService.findTop();
    return plainToInstance(WishResponseDto, wishes, opts);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: { id: number },
  ) {
    const wish = await this.wishesService.findOne(id);
    const result = plainToInstance(WishResponseDto, wish, opts);
    if (result.offers) {
      for (const offer of result.offers) {
        if (
          offer.hidden &&
          user.id !== result.owner?.id &&
          user.id !== offer.user?.id
        ) {
          offer.amount = 0;
        }
      }
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
    return plainToInstance(WishResponseDto, wish, opts);
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
    return plainToInstance(WishResponseDto, wish, opts);
  }
}
