import { Module } from '@nestjs/common';
import { ConfigModule } from "./shared/modules/config.module";
import { DatabaseModule } from "./shared/modules/db-connection.module";
import { UserModule } from './modules/user/user.module';
import { BuyItemModule } from './modules/buy-item/buy-item.module';
import { PurchaseModule } from "./modules/purchase/purchase.module";
import { ItemModule } from "./modules/item/item.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    ItemModule,
    PurchaseModule,
    BuyItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}