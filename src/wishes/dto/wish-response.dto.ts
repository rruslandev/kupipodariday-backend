import { Exclude, Expose, Type } from 'class-transformer';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { OfferResponseDto } from '../../offers/dto/offer-response.dto';

@Exclude()
export class WishResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  name: string;

  @Expose()
  link: string;

  @Expose()
  image: string;

  @Expose()
  price: number;

  @Expose()
  raised: number;

  @Expose()
  copied: number;

  @Expose()
  description: string;

  @Expose()
  @Type(() => UserPublicProfileResponseDto)
  owner: UserPublicProfileResponseDto;

  @Expose()
  @Type(() => OfferResponseDto)
  offers: OfferResponseDto[];
}
