import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password (8-32 characters)',
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @MinLength(3, { message: 'Current password must be at least 3 characters long.' })
  currentPassword!: string;

  @ApiProperty({
    description: 'New password (3-... characters, must include at least one uppercase letter and one number)',
    minLength: 3,
  })
  @IsString()
  @MinLength(3, { message: 'New password must be at least 3 characters long.' })
  newPassword!: string;
}