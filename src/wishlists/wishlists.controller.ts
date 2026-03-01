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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthUser } from '../common/decorators';
import { toPublicProfile, sanitizeWish } from '../common/helpers';
import type { Wishlist } from './entities/wishlist.entity';

function sanitizeWishlist(wishlist: Wishlist) {
  return {
    id: wishlist.id,
    createdAt: wishlist.createdAt,
    updatedAt: wishlist.updatedAt,
    name: wishlist.name,
    description: wishlist.description,
    image: wishlist.image,
    owner: wishlist.owner ? toPublicProfile(wishlist.owner) : undefined,
    items: wishlist.items?.map(sanitizeWish) ?? [],
  };
}

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async findAll() {
    const lists = await this.wishlistsService.findAll();
    return lists.map(sanitizeWishlist);
  }

  @Post()
  async create(
    @AuthUser() user: { id: number },
    @Body() dto: CreateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.create(dto, user.id);
    return sanitizeWishlist(wishlist);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne(id);
    return sanitizeWishlist(wishlist);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: { id: number },
    @Body() dto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.updateOne(id, user.id, dto);
    return sanitizeWishlist(wishlist);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: { id: number },
  ) {
    return this.wishlistsService.removeOne(id, user.id);
  }
}
