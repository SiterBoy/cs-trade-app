import { ApiProperty } from '@nestjs/swagger';
import postgres from "postgres";

export class ItemWithMinimalPricesDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  market_hash_name: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  suggested_price: number;

  @ApiProperty()
  item_page: string;

  @ApiProperty()
  market_page: string;

  @ApiProperty()
  max_price: number;

  @ApiProperty()
  mean_price: number;

  @ApiProperty()
  median_price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  is_tradable: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ nullable: true, type: Number })
  min_price?: number | null;

  @ApiProperty({ nullable: true, type: Number })
  min_tradable_price?: number | null;

  @ApiProperty({ nullable: true, type: Number })
  min_not_tradable_price?: number | null;

  constructor(item: postgres.Row) {
    this.id = item.id;
    this.market_hash_name = item.market_hash_name;
    this.currency = item.currency;
    this.suggested_price = item.suggested_price;
    this.item_page = item.item_page;
    this.market_page = item.market_page;
    this.min_price = item.min_price ? item.min_price : null;
    this.max_price = item.max_price;
    this.mean_price = item.mean_price;
    this.median_price = item.median_price;
    this.quantity = item.quantity;
    this.is_tradable = item.is_tradable;
    this.created_at = item.created_at;
    this.updated_at = item.updated_at;
    this.min_tradable_price = item.min_tradable_price ? item.min_tradable_price : null;
    this.min_not_tradable_price = item.min_not_tradable_price ? item.min_not_tradable_price : null;
  }
}