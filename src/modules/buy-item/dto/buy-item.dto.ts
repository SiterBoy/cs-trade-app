import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class BuyItemDto {
  @ApiProperty({ description: 'ID of the item to purchase' })
  @IsInt()
  @Min(1)
  itemId!: number;

  @ApiProperty({ description: 'Quantity of the item to purchase', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}