import {
  IsString,
  IsUrl,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name?: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description?: string;
}
