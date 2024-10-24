import { Controller, Get, Inject } from "@nestjs/common";
import { ItemService } from './item.service';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import Redis from "ioredis";
import { ItemWithMinimalPricesDto } from "./dto/item.dto";
import { ErrorResponseDto } from "../../shared/dto/error-response.dto";

@ApiTags('Item')
@Controller('item')
export class ItemController {
  private readonly cacheKey = 'min-price-items';
  constructor(
    private readonly itemService: ItemService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) {}

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

    await this.redisClient.set(this.cacheKey, JSON.stringify(result));
    return result;
  }
}