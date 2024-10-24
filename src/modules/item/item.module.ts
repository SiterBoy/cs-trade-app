import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from "./item.controller";
import { RedisModule } from "../../shared/modules/redis.module";

@Module({
  imports: [RedisModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService]
})
export class ItemModule {}
