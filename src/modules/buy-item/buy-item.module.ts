import { Module } from '@nestjs/common';
import { BuyItemService } from './buy-item.service';
import { UserModule } from "../user/user.module";
import { ItemModule } from "../item/item.module";
import { PurchaseModule } from "../purchase/purchase.module";
import { DatabaseModule } from "../../shared/modules/db-connection.module";
import { BuyItemController } from "./buy-item.controller";

@Module({
  imports: [DatabaseModule, UserModule, ItemModule, PurchaseModule],
  controllers: [BuyItemController],
  providers: [BuyItemService],
  exports: [BuyItemService]
})
export class BuyItemModule {}
