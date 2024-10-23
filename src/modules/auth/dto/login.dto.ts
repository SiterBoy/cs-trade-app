import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user123', description: 'User login' })
  @IsString()
  login!: string;

  @ApiProperty({ example: 'strongpassword', description: 'User password' })
  @IsString()
  password!: string;
}