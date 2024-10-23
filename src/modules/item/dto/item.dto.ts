import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty({ example: 1, description: 'Item ID' })
  id!: number;

  @ApiProperty({ example: 'AK-47 | Aquamarine Revenge (Factory New)', description: 'Item name' })
  market_hash_name!: string;

  @ApiProperty({ example: 'EUR', description: 'Currency' })
  currency!: string;

  @ApiProperty({ example: 18.73, description: 'Suggested price' })
  suggested_price!: number;

  @ApiProperty({ example: 'https://example.com/item-page', description: 'Item page URL' })
  item_page!: string;

  @ApiProperty({ example: 'https://example.com/market-page', description: 'Market page URL' })
  market_page!: string;

  @ApiProperty({ example: 15.0, description: 'Minimum price' })
  min_price!: number;

  @ApiProperty({ example: 25.0, description: 'Maximum price' })
  max_price!: number;

  @ApiProperty({ example: 20.0, description: 'Mean price' })
  mean_price!: number;

  @ApiProperty({ example: 18.0, description: 'Median price' })
  median_price!: number;

  @ApiProperty({ example: 10, description: 'Quantity available' })
  quantity!: number;

  @ApiProperty({ example: true, description: 'Is the item tradable' })
  is_tradable!: boolean;

  @ApiProperty({ example: '2023-10-10T10:10:10Z', description: 'Created at timestamp' })
  created_at!: Date;

  @ApiProperty({ example: '2023-10-10T10:10:10Z', description: 'Updated at timestamp' })
  updated_at!: Date;
}