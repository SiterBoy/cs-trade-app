import { Injectable } from '@nestjs/common';
import { Sql } from 'postgres';

@Injectable()
export class PurchaseService {
  constructor() {
  }

  async createPurchaseWithTransaction(
    userId: number,
    itemId: number,
    unitPrice: number,
    quantity: number,
    transaction: Sql
  ): Promise<void> {
    try {
      await transaction`
      INSERT INTO purchases (user_id, item_id, unit_price, quantity, purchase_date)
      VALUES (${userId}, ${itemId}, ${unitPrice}, ${quantity}, CURRENT_TIMESTAMP)
    `;
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw error;
    }
  }
}