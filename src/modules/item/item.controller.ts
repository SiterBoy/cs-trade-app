import { Controller, Get } from '@nestjs/common';
import { ItemService } from './item.service';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ItemDto } from './dto/item.dto';

@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiOperation({ summary: 'Get two items with minimum prices: one tradable and one non-tradable' })
  @ApiResponse({
    status: 200,
    description: 'Returns two items with minimum prices',
    type: ItemDto,
    isArray: true,
  })
  @Get('min-prices')
  async getTwoMinPrices(): Promise<ItemDto[]> {
    return await this.itemService.findTwoMinPrices();
  }
}