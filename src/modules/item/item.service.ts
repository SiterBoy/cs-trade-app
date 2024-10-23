import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Sql } from 'postgres';
import { ItemDto } from "./dto/item.dto";

@Injectable()
export class ItemService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Sql){}

  async findTwoMinPrices(): Promise<ItemDto[]> {
    try {
      const items = await this.db`
        SELECT *
        FROM (
          SELECT *,
            ROW_NUMBER() OVER (PARTITION BY is_tradable ORDER BY min_price ASC) as row_num
          FROM items
        ) AS ranked_items
        WHERE row_num = 1
        ORDER BY is_tradable;
      `;

      if (items.length === 0) {
        throw new HttpException('No items found', HttpStatus.NOT_FOUND);
      }

      return items.map((item) => new ItemDto(item));
    } catch (error) {
      throw new HttpException('Database query error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findItemByIdWithTransaction(itemId: number, transaction: Sql): Promise<ItemDto> {
    try {
      const items = await transaction`
      SELECT * FROM items WHERE id = ${itemId} FOR UPDATE
    `;
      return new ItemDto(items[0]);
    } catch (error) {
      console.error('Error retrieving item by ID:', error);
      throw error;
    }
  }

  async updateItemQuantityWithTransaction(itemId: number, newQuantity: number, transaction: Sql): Promise<void> {
    try {
      await transaction`
      UPDATE items SET quantity = ${newQuantity} WHERE id = ${itemId}
    `;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  }
}