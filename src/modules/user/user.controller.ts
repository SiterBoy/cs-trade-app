// src/modules/user/user.controller.ts

import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  NotFoundException,
  BadRequestException, Get
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from './user.service';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { Request } from 'express';
import * as bcrypt from "bcrypt";
import { SuccessResponseDto } from '../../shared/dto/success-response.dto';
import { ErrorResponseDto } from "../../shared/dto/error-response.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 201, description: 'Random user created successfully', type: CreateUserDto })
  @ApiResponse({ status: 500, description: 'Failed to create random user', type: ErrorResponseDto })
  @Get('create-random')
  async createRandomUser(): Promise<CreateUserDto> {
    try {
      const newUserDto = await this.userService.createRandomUser();
      return newUserDto;
    } catch (error) {
      console.error('Error in createRandomUser:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Password updated successfully', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: 'Current password is incorrect', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponseDto })
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<SuccessResponseDto> {
    try {
      const user = req.user;
      if (!user || !user.userId) {
        throw new UnauthorizedException('Unauthorized');
      }

      const userId = user.userId;

      const { currentPassword, newPassword } = changePasswordDto;

      const existingUser = await this.userService.findUserById(userId);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        existingUser.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await this.userService.updatePassword(userId, hashedNewPassword);

      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  }
}