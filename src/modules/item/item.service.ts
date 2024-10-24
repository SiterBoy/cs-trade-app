import {  Injectable } from "@nestjs/common";
import { Sql } from 'postgres';
import { CombinedItem, Item } from "./interfaces/items.interfaces";
import axios, { AxiosResponse } from 'axios';
import { ItemWithMinimalPricesDto } from "./dto/item.dto";

@Injectable()
export class ItemService {
  constructor(){}


    async getItemsWithMinimalPrices(): Promise<ItemWithMinimalPricesDto[]> {
    try {
      const tradableUrl = 'https://api.skinport.com/v1/items?tradable=1';
      const nonTradableUrl = 'https://api.skinport.com/v1/items?tradable=0';

      const [tradableResponse, nonTradableResponse]: [AxiosResponse<Item[]>, AxiosResponse<Item[]>] = await Promise.all([
        axios.get<Item[]>(tradableUrl),
        axios.get<Item[]>(nonTradableUrl),
      ]);

      const tradableItems = tradableResponse.data;
      const nonTradableItems = nonTradableResponse.data;

      const tradableMap: { [key: string]: Item } = {};
      tradableItems.forEach(item => {
        tradableMap[item.market_hash_name] = item;
      });

      const nonTradableMap: { [key: string]: Item } = {};
      nonTradableItems.forEach(item => {
        nonTradableMap[item.market_hash_name] = item;
      });

      const allMarketHashNames = new Set<string>([
        ...Object.keys(tradableMap),
        ...Object.keys(nonTradableMap),
      ]);

      const combinedItems: CombinedItem[] = [];

      for (const name of allMarketHashNames) {
        const tradableItem = tradableMap[name];
        const nonTradableItem = nonTradableMap[name];

        const baseItem = tradableItem || nonTradableItem;

        if (baseItem) {

          const { min_price, ...baseItemWithoutMinPrice } = baseItem;

          const combinedItem: CombinedItem = {
            ...baseItemWithoutMinPrice,
            min_tradable_price: tradableItem.min_price,
            min_not_tradable_price: nonTradableItem.min_price,
          };

          combinedItems.push(combinedItem);
        }
      }

      return combinedItems.map((item) => new ItemWithMinimalPricesDto(item));
    } catch (error) {
      console.error('Error while getting and combining items:', error);
      throw error;
    }
  }
  //async findTwoMinPrices()Ж
  // async findTwoMinPrices(): Promise<ItemDto[]> {
  //   try {
  //     const items = await this.db`
  //       SELECT *
  //       FROM (
  //         SELECT *,
  //           ROW_NUMBER() OVER (PARTITION BY is_tradable ORDER BY min_price ASC) as row_num
  //         FROM items
  //       ) AS ranked_items
  //       WHERE row_num = 1
  //       ORDER BY is_tradable;
  //     `;
  //
  //     if (items.length === 0) {
  //       throw new HttpException('No items found', HttpStatus.NOT_FOUND);
  //     }
  //
  //     return items.map((item) => new ItemDto(item));
  //   } catch (error) {
  //     throw new HttpException('Database query error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async findItemByIdWithTransaction(itemId: number, transaction: Sql): Promise<ItemWithMinimalPricesDto> {
    try {
      const items = await transaction`
      SELECT * FROM items WHERE id = ${itemId} FOR UPDATE
    `;
      return new ItemWithMinimalPricesDto(items[0]);
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