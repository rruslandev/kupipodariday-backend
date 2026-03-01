import {
  IsString,
  IsUrl,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  description?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
