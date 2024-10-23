// src/modules/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User ID' })
  id!: number;

  @ApiProperty({ description: 'User login' })
  login!: string;

  @ApiProperty({ description: 'User password (plain text)' })
  password!: string;

  @ApiProperty({ description: 'User balance' })
  balance!: number;

  @ApiProperty({ description: 'Creation date' })
  created_at!: Date;

  @ApiProperty({ description: 'Update date' })
  updated_at!: Date;
}