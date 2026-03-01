import { IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @IsNumber()
  @Min(1)
  itemId: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
