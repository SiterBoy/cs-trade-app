// src/modules/buy-item/buy-item.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BuyItemService } from './buy-item.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BuyItemDto } from './dto/buy-item.dto';
import { ErrorResponseDto } from '../../shared/dto/error-response.dto';
import { Request } from 'express';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SuccessBuyResponseDto } from "./dto/success-buy-response.dto";

@ApiTags('Buy Item')
@ApiBearerAuth()
@Controller('buy-item')
export class BuyItemController {
  constructor(private readonly buyItemService: BuyItemService) {}

  @ApiOperation({ summary: 'Purchase an item' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'Item purchased successfully',
    type: SuccessBuyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User or item not found',
    type: ErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async buyItem(
    @Req() req: Request,
    @Body() buyItemDto: BuyItemDto,
  ): Promise<SuccessBuyResponseDto> {
    const user = req.user;

    if (!user || !user.userId) {
      throw new Error('Invalid user');
    }

    const userId = user.userId;
    const { itemId, quantity } = buyItemDto;

    const remainingBalance = await this.buyItemService.buyItem(userId, itemId, quantity);

    return { remainingBalance };
  }
}