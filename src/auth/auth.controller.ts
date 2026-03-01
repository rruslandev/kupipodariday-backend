import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from '../common/decorators';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { toUserProfile } from '../common/helpers';
import type { User } from '../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.authService.signup(dto);
    return toUserProfile(user);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Req() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
