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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistResponseDto } from './dto/wishlist-response.dto';
import { AuthUser } from '../common/decorators';

const opts = { excludeExtraneousValues: true } as const;

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async findAll() {
    const lists = await this.wishlistsService.findAll();
    return plainToInstance(WishlistResponseDto, lists, opts);
  }

  @Post()
  async create(
    @AuthUser() user: { id: number },
    @Body() dto: CreateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.create(dto, user.id);
    return plainToInstance(WishlistResponseDto, wishlist, opts);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne(id);
    return plainToInstance(WishlistResponseDto, wishlist, opts);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: { id: number },
    @Body() dto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.updateOne(id, user.id, dto);
    return plainToInstance(WishlistResponseDto, wishlist, opts);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: { id: number },
  ) {
    return this.wishlistsService.removeOne(id, user.id);
  }
}
