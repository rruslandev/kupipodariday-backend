import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { AuthUser } from '../common/decorators';
import {
  toUserProfile,
  toPublicProfile,
  sanitizeWish,
} from '../common/helpers';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@AuthUser() user: { id: number }) {
    const me = await this.usersService.findById(user.id);
    return toUserProfile(me);
  }

  @Patch('me')
  async updateMe(@AuthUser() user: { id: number }, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.updateOne(user.id, dto);
    return toUserProfile(updated);
  }

  @Get('me/wishes')
  async getMyWishes(@AuthUser() user: { id: number }) {
    const wishes = await this.usersService.findWishes(user.id);
    return wishes.map(sanitizeWish);
  }

  @Post('find')
  async findUsers(@Body() dto: FindUsersDto) {
    const users = await this.usersService.findMany(dto.query);
    return users.map(toUserProfile);
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new NotFoundException('Пользователь не найден');
    return toPublicProfile(user);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const wishes = await this.usersService.findWishesByUsername(username);
    return wishes.map(sanitizeWish);
  }
}
