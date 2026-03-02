import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from '../common/decorators';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserPublicProfileResponseDto } from '../users/dto/user-public-profile-response.dto';
import type { User } from '../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.authService.signup(dto);
    return plainToInstance(UserPublicProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Req() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
