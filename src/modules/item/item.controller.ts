import { Controller, Get, Inject } from "@nestjs/common";
import { ItemService } from './item.service';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import Redis from "ioredis";
import { ItemWithMinimalPricesDto } from "./dto/item.dto";
import { ErrorResponseDto } from "../../shared/dto/error-response.dto";
import { ConfigService } from "@nestjs/config";

@ApiTags('Item')
@Controller('item')
export class ItemController {
  private readonly cacheKey = 'min-price-items';
  private readonly itemsCachingTimeSecond: number;
  constructor(
    private readonly itemService: ItemService,
    private readonly configService:ConfigService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) {
    this.itemsCachingTimeSecond = +this.configService.getOrThrow<number>('PAIRS_WITH_MIN_PRICES_STORAGE_TIME_SECOND')
  }

  // @ApiOperation({ summary: 'Get two items with minimum prices: one tradable and one non-tradable' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns two items with minimum prices',
  //   type: ItemDto,
  //   isArray: true,
  // })
  // @Get('min-prices')
  // async getTwoMinPrices(): Promise<ItemDto[]> {
  //   return await this.itemService.findTwoMinPrices();
  // }

  @ApiOperation({ summary: 'Get two items with minimum prices: one tradable and one non-tradable' })
  @ApiResponse({
    status: 200,
    description: 'Returns two items with minimum prices',
    type: ItemWithMinimalPricesDto,
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponseDto })
  @Get('min-prices')
  async getItemsWithMinPrices() {
    const cacheResult = await this.redisClient.get(this.cacheKey);

    if(cacheResult) {
      return cacheResult;
    }
    const result = await this.itemService.getItemsWithMinimalPrices();

    await this.redisClient.set(this.cacheKey, JSON.stringify(result), 'EX', this.itemsCachingTimeSecond);
    return result;
  }
}