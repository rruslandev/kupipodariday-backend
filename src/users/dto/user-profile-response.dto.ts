import { Expose } from 'class-transformer';
import { UserPublicProfileResponseDto } from './user-public-profile-response.dto';

export class UserProfileResponseDto extends UserPublicProfileResponseDto {
  @Expose()
  email: string;
}
