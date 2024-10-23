import { Injectable, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Sql } from 'postgres';
import { UserService } from "../user/user.service";
import { ItemService } from "../item/item.service";
import { PurchaseService } from "../purchase/purchase.service";

@Injectable()
export class BuyItemService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Sql,
    private readonly userService: UserService,
    private readonly itemService: ItemService,
    private readonly purchaseService: PurchaseService,
  ) {}

  async buyItem(userId: number, itemId: number, quantity: number): Promise<number> {
    return this.db.begin(async (transaction) => {

      const user = await this.userService.findUserByIdWithTransaction(userId, transaction);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const item = await this.itemService.findItemByIdWithTransaction(itemId, transaction);

      if (!item) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
      }

      const unitPrice = item.suggested_price;
      const totalPrice = unitPrice * quantity;

      if (user.balance < totalPrice) {
        throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
      }

      if (item.quantity < quantity) {
        throw new HttpException('Insufficient item quantity', HttpStatus.BAD_REQUEST);
      }

      const newBalance = user.balance - totalPrice;

      await this.userService.updateUserBalanceWithTransaction(userId, user.balance - totalPrice, transaction);


      await this.itemService.updateItemQuantityWithTransaction(itemId, item.quantity - quantity, transaction);


      await this.purchaseService.createPurchaseWithTransaction(userId, itemId, unitPrice, quantity, transaction);

      return newBalance;
    });
  }
}