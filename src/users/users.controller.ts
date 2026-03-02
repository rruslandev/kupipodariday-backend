import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { WishResponseDto } from '../wishes/dto/wish-response.dto';
import { AuthUser } from '../common/decorators';

const publicOpts = { excludeExtraneousValues: true } as const;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@AuthUser() user: { id: number }) {
    const me = await this.usersService.findById(user.id);
    return plainToInstance(UserProfileResponseDto, me, publicOpts);
  }

  @Patch('me')
  async updateMe(@AuthUser() user: { id: number }, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.updateOne(user.id, dto);
    return plainToInstance(UserProfileResponseDto, updated, publicOpts);
  }

  @Get('me/wishes')
  async getMyWishes(@AuthUser() user: { id: number }) {
    const wishes = await this.usersService.findWishes(user.id);
    return plainToInstance(WishResponseDto, wishes, publicOpts);
  }

  @Post('find')
  async findUsers(@Body() dto: FindUsersDto) {
    const users = await this.usersService.findMany(dto.query);
    return plainToInstance(UserPublicProfileResponseDto, users, publicOpts);
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new NotFoundException('Пользователь не найден');
    return plainToInstance(UserPublicProfileResponseDto, user, publicOpts);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const wishes = await this.usersService.findWishesByUsername(username);
    return plainToInstance(WishResponseDto, wishes, publicOpts);
  }
}
