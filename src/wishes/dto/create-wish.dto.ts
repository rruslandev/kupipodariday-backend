import {
  IsString,
  IsUrl,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description: string;
}
